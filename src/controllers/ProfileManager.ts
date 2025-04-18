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

namespace PresetToken {
    export const PREFIX = 'decksp';
    export const DEFAULT_SUFFIX = 'default';
    export const DEFAULT_NAME = `${PREFIX}.${DEFAULT_SUFFIX}`;
    export const enum Type {
        GAME = 'game',
        CUSTOM = 'custom',
    }
}

export class ProfileManager {
    private static instance: ProfileManager;
    private setReady: Dispatch<SetStateAction<boolean>> = (_) => { };
    private setData: DataProviderSetData<PluginData> = (_) => { };
    private queudGameChangeHandler: null | (() => Promise<any>) = null;
    manuallyApply: boolean = false;
    activeProfileId: string = globalAppId;
    manualProfileId: string = globalAppId;
    currentUserId: string = '';
    watchedGames: { [appId: string]: boolean } = {};
    currentUserProfiles: { [id: string]: Profile<ProfileType> } = {};
    otherUserProfiles: { [userId: string]: { [id: string]: Profile<ProfileType> } } = {};
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
        return this.currentUserProfiles[this.activeProfileId];
    }

    get activeProfilePresetName() {
        const profile = this.currentUserProfiles[this.activeProfileId];
        return ProfileManager.makePresetName(this.currentUserId, profile.id, profile.type);
    }

    async init(userId: string) {
        const initProfilesRes = await this.initProfiles(userId);
        if (initProfilesRes instanceof Error) return initProfilesRes;

        const createDefaultsRes = !initProfilesRes.hasDefault ? await this.createDefaults() : null;
        if (createDefaultsRes instanceof Error) return createDefaultsRes;

        const createGloableProfileRes = !this.currentUserProfiles[globalAppId] ? await this.createGlobalProfile() : null;
        if (createGloableProfileRes instanceof Error) return createGloableProfileRes;

        const watchRes = !this.watchedGames[globalAppId] ? await this.setWatchGame(globalAppId, true) : null;
        if (watchRes instanceof Error) return watchRes;

        const applyProfileRes = await this.applyProfile(initProfilesRes.profileToApply);
        if (applyProfileRes instanceof Error) return applyProfileRes;

        this.initActiveGameReaction();
        return applyProfileRes;
    }

    private async initProfiles(userId: string) {
        try {
            let profileToApply: string = '';
            this.currentUserId = userId;
            const { manualPreset, allPresets, watchedGames, manuallyApply } = await Backend.initProfiles(ProfileManager.makePresetName(userId, globalAppId, ProfileType.Game), userId);
            const { users, hasDefault } = ProfileManager.parseProfiles(allPresets);
            const { [userId]: profiles, ...otherUserProfiles } = users;
            this.currentUserProfiles = profiles ?? {};
            this.otherUserProfiles = otherUserProfiles;
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

        const createProfileRes = !this.currentUserProfiles[profileId] ? await this.createGameProfile(profileId) : null;
        if (createProfileRes instanceof Error) return createProfileRes;

        return await this.applyProfile(profileId);
    }

    async createCustomProfile(profileName: string, fromProfileId?: string) {
        try {
            const profile = ProfileManager.makeProfileType(profileName, ProfileType.Custom);
            const presetName = ProfileManager.makePresetName(this.currentUserId, profileName, ProfileType.Custom);

            const fromProfile = fromProfileId ? this.currentUserProfiles[fromProfileId] : undefined;
            const fromPresetName = fromProfileId === 'default' ? PresetToken.DEFAULT_NAME :
                fromProfile ? ProfileManager.makePresetName(this.currentUserId, fromProfile.id, fromProfile.type) : undefined;
            const res = await Backend.newPreset(presetName, fromPresetName);

            this.currentUserProfiles[profileName] = profile;
            return res;
        } catch (e) {
            return useError(`Problem creating custom profile: ${profileName}`, e);
        }
    }

    async createGameProfile(appId: string) {
        try {
            const profile = ProfileManager.makeProfileType(appId, ProfileType.Game);
            const presetName = ProfileManager.makePresetName(this.currentUserId, appId, ProfileType.Game);
            const res = await Backend.newPreset(presetName);

            this.currentUserProfiles[appId] = profile;
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
            return await Backend.createDefaultPreset(PresetToken.DEFAULT_NAME);
        } catch (e) {
            return useError(`Problem creating default preset`, e);
        }
    }

    async deleteProfile(profileId: string) {
        const presetName = ProfileManager.makePresetName(this.currentUserId, profileId, ProfileType.Custom);

        try {
            const res = await Backend.deletePreset(presetName);

            delete this.currentUserProfiles[profileId];
            return res;
        } catch (e) {
            return useError(`Problem deleting profile id: ${profileId}`, e);
        }
    }

    async applyProfile(profileId: string, isManuallyApplied: boolean = false) {
        try {
            const profile = this.currentUserProfiles[profileId];
            if (!profile) return useError(`Problem applying profile id: ${profileId}`, 'Profile does not exist');

            const presetName = ProfileManager.makePresetName(this.currentUserId, profileId, profile.type);
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
            return await Backend.setDspDefaults(PresetToken.DEFAULT_NAME);
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
        const output: {
            users: {
                [userId: string]: {
                    [profileId: string]: Profile<ProfileType>
                }
            },
            hasDefault: boolean
        } = { users: {}, hasDefault: false };

        jdspPresets.split(/\n/).flatMap(presetName => {
            if (presetName === PresetToken.DEFAULT_NAME) output.hasDefault = true;
            return ProfileManager.parsePresetName(presetName) ?? [];
        }).forEach(({ id: profileId, type, userId }) => {
            const profile = ProfileManager.makeProfileType(profileId, type);
            if (!(userId in output.users)) output.users[userId] = {};
            output.users[userId][profileId] = profile;
        });
        return output;
    }

    static parsePresetName(jdspPreset: string) {
        const prefix = `${PresetToken.PREFIX}.`
        const suffix = jdspPreset.startsWith(prefix) ? jdspPreset.slice(prefix.length) : null;
        if (!suffix || suffix === PresetToken.DEFAULT_SUFFIX) return null;

        const regex = new RegExp(`^(\\w+)\\.(${PresetToken.Type.CUSTOM}|${PresetToken.Type.GAME}):(.+)$`)
        const match = suffix.match(regex);
        if (match) {
            const [, userId, type, id] = match;
            return { userId, id, type: type === PresetToken.Type.CUSTOM ? ProfileType.Custom : ProfileType.Game };
        }
        return null;
    }

    static makePresetName(userId: string, id: string, type: ProfileType) {
        let typeStr;
        switch (type) {
            case ProfileType.Game:
                typeStr = PresetToken.Type.GAME;
                break
            case ProfileType.Custom:
                typeStr = PresetToken.Type.CUSTOM;
                break
        }
        return `${PresetToken.PREFIX}.${userId}.${typeStr}:${id}`
    }

    static makeProfileType(id: string, type: ProfileType) {
        return type === ProfileType.Custom ? { id, type: ProfileType.Custom, get name() { return this.id } } :
            id === globalAppId ? { id, type: ProfileType.Game, name: globalProfileName } :
                { id, type: ProfileType.Game, get name() { return getAppName(id) } };
    }
}

export const profileManager = new ProfileManager();