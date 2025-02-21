import { IReactionDisposer, makeObservable, observable, reaction } from 'mobx';
import { MakeQueryablePromise, PromiseStatus, getActiveAppId, getAppName, useError } from '../lib/utils';
import { Backend } from './Backend';
import { DSPParamSettings } from '../types/dspTypes';
import { Dispatch, SetStateAction } from 'react';
import { DataProviderSetData } from '../contexts/contexts';
import { PluginData, ProfileType, Profile } from '../types/types';
import { ToastAppliedProfile } from '../components/profile/ApplyProfileToast';
import { globalAppId } from '../defines/constants';
import { globalProfileName } from '../defines/constants';

const jdspPresetPrefix = 'decksp.';
const jdspGamePresetIdentifier = 'game:';
const jdspUserPresetIndentifier = 'user:';

const defaultStr = 'default';
const defaultPresetName = jdspPresetPrefix + defaultStr;

export class ProfileManager {
    private static instance: ProfileManager;
    private setReady: Dispatch<SetStateAction<boolean>> = (_) => { };
    private setData: DataProviderSetData<PluginData> = (_) => { };
    private queudGameChangeHandler: null | (() => Promise<any>) = null;
    manuallyApply: boolean = false;
    activeProfileId: string = globalAppId;
    manualProfileId: string = globalAppId;
    watchedGames: { [appId: string]: boolean } = {};
    profiles: { [id: string]: Profile<ProfileType> } = {};
    lock?: { promise: Promise<DSPParamSettings | Error>, status: PromiseStatus };
    activeGameReactionDisposer?: IReactionDisposer;
    unknownProfile: boolean = true;
    active: boolean = false;

    constructor() {
        makeObservable(this, { activeProfileId: observable, manuallyApply: observable, unknownProfile: observable });
        if (!ProfileManager.instance) ProfileManager.instance = this;
        return ProfileManager.instance;
    }

    get activeProfile(): Profile<ProfileType> | undefined {
        return this.profiles[this.activeProfileId];
    }

    async init() {
        const initProfilesRes = await this.initProfiles();
        if (initProfilesRes instanceof Error) return initProfilesRes;

        const createDefaultsRes = !initProfilesRes.hasDefault ? await this.createDefaults() : null;
        if (createDefaultsRes instanceof Error) return createDefaultsRes;

        const createGloableProfileRes = !this.profiles[globalAppId] ? await this.createGlobalProfile() : null;
        if (createGloableProfileRes instanceof Error) return createGloableProfileRes;

        const watchRes = !this.watchedGames[globalAppId] ? await this.setWatchGame(globalAppId, true) : null;
        if (watchRes instanceof Error) return watchRes;

        const applyProfileRes = await this.applyProfile(initProfilesRes.profileToApply);
        if (applyProfileRes instanceof Error) return applyProfileRes;

        this.initActiveGameReaction();
        return applyProfileRes;
    }

    private async initProfiles() {
        try {
            let profileToApply: string = '';
            const { manualPreset, allPresets, watchedGames, manuallyApply } = await Backend.initProfiles(jdspPresetPrefix + jdspGamePresetIdentifier + globalAppId);
            const { profiles, hasDefault } = ProfileManager.parseProfiles(allPresets);

            this.profiles = profiles;
            this.watchedGames = watchedGames;
            this.manuallyApply = manuallyApply;

            const { id: profileId } = ProfileManager.parsePresetName(manualPreset) ?? {};
            if (!profileId) return useError(`Problem parsing manually applied jdsp preset`, `"${manualPreset}" cannot be parsed as a preset}`);
            this.manualProfileId = profileId;

            if (manuallyApply) {
                profileToApply = profileId;
            } else {
                profileToApply = this.watchedGames[getActiveAppId()] ? getActiveAppId() : globalAppId;
            }

            return { profileToApply, hasDefault };
        } catch (e) {
            return useError('Problem when trying to load profiles', e);
        }
    }

    private initActiveGameReaction() {
        this.activeGameReactionDisposer = reaction(() => SteamUIStore.MainRunningAppID, this.onActiveGameChange.bind(this));
    }

    private async onActiveGameChange(activeAppIdString: number = 769) {
        const activeAppId = activeAppIdString.toString();
        if (this.active && !this.manuallyApply && this.watchedGames[activeAppId] && this.activeProfileId !== activeAppId) {
            const handle = async () => {
                this.setReady(false);
                const applyProfile = this.applyProfile(activeAppId);
                this.setLock(applyProfile);
                const dsp = await applyProfile;

                const errors: { plugin?: Error, dsp?: Error } = {};
                const newData: PluginData = { errors: errors };

                if (dsp instanceof Error) errors.dsp = dsp;
                else newData.dsp = dsp;

                this.setData(data => ({ ...data, ...newData }));
                this.setReady(true);
                if (this.queudGameChangeHandler) {
                    const handle = this.queudGameChangeHandler;
                    this.queudGameChangeHandler = null;
                    handle();
                }
            };

            if (this.lock && this.lock.status === PromiseStatus.Pending) this.queudGameChangeHandler = handle;
            else handle();
        }
    }

    assignSetters(setData: DataProviderSetData<PluginData>, setReady: Dispatch<SetStateAction<boolean>>) {
        this.setData = setData;
        this.setReady = setReady;
    }

    setLock(promise: Promise<DSPParamSettings | Error>) {
        if (!this.lock || this.lock.status !== PromiseStatus.Pending) {
            this.lock = MakeQueryablePromise(promise);
            return;
        }
    }

    async setGameSpecificProfileEnabled(enable: boolean) {
        const profileId = enable ? getActiveAppId() : globalAppId;

        const watchRes = getActiveAppId() !== globalAppId ? await this.setWatchGame(getActiveAppId(), enable) : null;
        if (watchRes instanceof Error) return watchRes;

        const createProfileRes = !this.profiles[profileId] ? await this.createGameProfile(profileId) : null;
        if (createProfileRes instanceof Error) return createProfileRes;

        return await this.applyProfile(profileId);
    }

    async createUserProfile(profileName: string, fromProfileId?: string) {
        try {
            const profile = ProfileManager.makeProfileType(profileName, ProfileType.User);
            const presetName = ProfileManager.makePresetName(profileName, ProfileType.User);

            const fromProfile = fromProfileId ? this.profiles[fromProfileId] : undefined;
            const fromPresetName = fromProfileId === 'default' ? defaultPresetName :
                fromProfile ? ProfileManager.makePresetName(fromProfile.id, fromProfile.type) : undefined;
            const res = await Backend.newPreset(presetName, fromPresetName);

            this.profiles[profileName] = profile;
            return res;
        } catch (e) {
            return useError(`Problem creating custom profile: ${profileName}`, e);
        }
    }

    async createGameProfile(appId: string) {
        try {
            const profile = ProfileManager.makeProfileType(appId, ProfileType.Game);
            const presetName = ProfileManager.makePresetName(appId, ProfileType.Game);
            const res = await Backend.newPreset(presetName);

            this.profiles[appId] = profile;
            return res;
        } catch (e) {
            return useError(`Problem creating game profile id: ${appId}`, e);
        }
    }

    private createGlobalProfile() {
        return this.createGameProfile(globalAppId);
    }

    private async createDefaults() {
        try {
            return await Backend.createDefaultPreset(defaultPresetName);
        } catch (e) {
            return useError(`Problem creating default preset`, e);
        }
    }

    async deleteProfile(profileId: string) {
        const presetName = ProfileManager.makePresetName(profileId, ProfileType.User);

        try {
            const res = await Backend.deletePreset(presetName);

            delete this.profiles[profileId];
            return res;
        } catch (e) {
            return useError(`Problem deleting profile id: ${profileId}`, e);
        }
    }

    async applyProfile(profileId: string, isManuallyApplied: boolean = false) {
        try {
            const profile = this.profiles[profileId];
            if (!profile) return useError(`Problem applying profile id: ${profileId}`, 'Profile does not exist');

            const presetName = ProfileManager.makePresetName(profileId, profile.type);
            const res = await Backend.setProfile(presetName, isManuallyApplied);
            if (this.active) ToastAppliedProfile(profile, this, isManuallyApplied);

            if (isManuallyApplied) this.manualProfileId = profileId;
            this.activeProfileId = profileId;
            this.unknownProfile = false;
            return res;
        } catch (e) {
            this.unknownProfile = true;
            return useError(`Problem applying profile id: ${profileId}`, e);
        }
    }

    async setDefaults() {
        try {
            return await Backend.setDspDefaults(defaultPresetName);
        } catch (e) {
            return useError(`Problem setting jdsp parameters to default`, e);
        }
    }

    async setUseManualProfiles(useManual: boolean) {
        try {
            await Backend.setManuallyApplyProfiles(useManual);
            this.manuallyApply = useManual;

            const profileToApply = useManual ? this.manualProfileId : this.watchedGames[getActiveAppId()] ? getActiveAppId() : globalAppId;
            return await this.applyProfile(profileToApply, useManual);
        } catch (e) {
            return useError(`Problem try to set manual profile usage`, e)
        }
    }

    async setWatchGame(appId: string, watch: boolean) {
        try {
            const res = await Backend.setAppWatch(appId, watch);
            this.watchedGames[appId] = watch;
            return res;
        } catch (e) {
            return useError(`Problem trying to set app watch for appId: ${appId}`, e);
        }
    }

    static parseProfiles(jdspPresets: string) {
        const output: { profiles: { [id: string]: Profile<ProfileType> }, hasDefault: boolean } = { profiles: {}, hasDefault: false };

        output.profiles = Object.fromEntries(jdspPresets.split(/\n/).flatMap(presetName => {
            if (presetName === defaultPresetName) output.hasDefault = true;
            return ProfileManager.parsePresetName(presetName) ?? [];
        }).map(({ id: profileId, type }) => {
            const profile = ProfileManager.makeProfileType(profileId, type);
            return [profileId, profile];
        }));
        return output;
    }

    static parsePresetName(jdspPreset: string) {
        const suffix = jdspPreset.startsWith(jdspPresetPrefix) ? jdspPreset.slice(jdspPresetPrefix.length) : null;
        if (!suffix || suffix === defaultStr) return null;

        const isUser = suffix.startsWith(jdspUserPresetIndentifier);
        const profileId = suffix.startsWith(jdspGamePresetIdentifier) ? suffix.slice(jdspGamePresetIdentifier.length) :
            isUser ? suffix.slice(jdspUserPresetIndentifier.length) : null;
        if (!profileId) throw new Error(`Unknown id when parsing jdsp preset name: ${suffix}`);
        return { id: profileId, type: isUser ? ProfileType.User : ProfileType.Game };
    }

    static makePresetName(id: string, type: ProfileType) {
        switch (type) {
            case ProfileType.Game:
                return jdspPresetPrefix + jdspGamePresetIdentifier + id;
            case ProfileType.User:
                return jdspPresetPrefix + jdspUserPresetIndentifier + id;
        }
    }

    static makeProfileType(id: string, type: ProfileType) {
        return type === ProfileType.User ? { id, type: ProfileType.User, get name() { return this.id } } :
            id === globalAppId ? { id, type: ProfileType.Game, name: globalProfileName } :
                { id, type: ProfileType.Game, get name() { return getAppName(id) } };
    }
}

export const profileManager = new ProfileManager();