import { IReactionDisposer, makeObservable, observable, reaction } from 'mobx';
import { Log } from '../lib/log';
import { MakeQueryablePromise, PromiseStatus, getActiveAppId, getAppName, useError } from '../lib/utils';
import { Backend } from './Backend';
import { DSPParamSettings } from '../types/dspTypes';
import { Dispatch, SetStateAction } from 'react';
import { DataProviderSetData } from '../contexts/contexts';
import { PluginData } from '../types/types';

const jdspPresetPrefix = 'decksp.';
const jdspGamePresetIdentifier = 'game:';
const jdspUserPresetIndentifier = 'user:';

export const globalAppId = '769';
export const globalProfileName = 'Global';

const defaultStr = 'default';
const defaultPresetName = jdspPresetPrefix + defaultStr;

export class ProfileManager {
    private static instance: ProfileManager;
    manuallyApply: boolean = false;
    activeProfileId: string = globalAppId;
    manualProfileId: string = globalAppId;
    watchedGames: { [appId: string]: boolean } = {};
    // @observable
    profiles: { [id: string]: Profile<ProfileType> } = {};
    lock?: { promise: Promise<DSPParamSettings | Error>, status: PromiseStatus };
    activeGameReactionDisposer?: IReactionDisposer;
    setReady:  Dispatch<SetStateAction<boolean>> = (_) => { };
    setData:  DataProviderSetData<PluginData> = (_) => { };

    constructor() {
        makeObservable(this, { activeProfileId: observable });
        if (!ProfileManager.instance) ProfileManager.instance = this;
        return ProfileManager.instance;
    }

    get activeProfile(): Profile<ProfileType> | undefined {
        return this.profiles[this.activeProfileId];
    }

    get activeProfileIdNumber() {
        return parseInt(this.activeProfileId);
    }

    async init() {
        const initProfilesRes = await this.initProfiles();
        if (initProfilesRes instanceof Error) return initProfilesRes;

        const createDeafultProfileRes = !initProfilesRes.hasDefault ? await this.createDefaultProfile() : null;
        if (createDeafultProfileRes instanceof Error) return createDeafultProfileRes;

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
            //todo need to check/ handle if settings are new
            let profileToApply: string = '';
            const { manualPreset, allPresets, watchedGames, manuallyApply } = await Backend.initProfiles(jdspPresetPrefix + jdspGamePresetIdentifier + globalAppId);
            const { profiles, hasDefault } = ProfileManager.parseProfiles(allPresets);
            
            this.profiles = profiles;
            this.watchedGames = watchedGames;
            this.manuallyApply = manuallyApply;
            
            const { id: profileId } = ProfileManager.parsePresetName(manualPreset) ?? {};
            if (!profileId) return useError(`Problem parsing manually applied jdsp preset - "${manualPreset}" cannot be parsed as a preset}`);
            this.manualProfileId = profileId;

            if (manuallyApply) {
                profileToApply = profileId;
            } else {
                profileToApply = this.watchedGames[getActiveAppId()] ? getActiveAppId() : globalAppId;
            }
            
            return { profileToApply, hasDefault };
        } catch (err) {
            return useError(`Problem when trying to load profiles - \n ${(err as Error).message ?? ''}`);
        }
    }

    private initActiveGameReaction() {
        this.activeGameReactionDisposer = reaction(() => SteamUIStore.MainRunningAppID, this.onActiveGameChange.bind(this));
    }

    private onActiveGameChange(activeAppIdString: number = 769) {
        const activeAppId = activeAppIdString.toString();
        Log.log('game reaction called', activeAppId)
        if (!this.manuallyApply && this.watchedGames[activeAppId] && this.activeProfileId !== activeAppId) {
            this.setReady(false);
            const applyProfile = this.applyProfile(activeAppId);
            this.setLock(applyProfile);
            applyProfile.then(dsp => {
                const errors: { plugin?: Error, dsp?: Error } = {};
                const newData: PluginData = { errors: errors };

                if (dsp instanceof Error) errors.dsp = dsp;
                else newData.dsp = dsp;

                this.setData(data => ({ ...data, ...newData }));
                this.setReady(true);
            });
        }
    }

    assignSetters(setData: DataProviderSetData<PluginData>, setReady:  Dispatch<SetStateAction<boolean>>) {
        this.setData = setData;
        this.setReady = setReady;
    }

    setLock(promise: Promise<DSPParamSettings | Error>) {
        if (!this.lock || this.lock.status !== PromiseStatus.pending) {
            this.lock = MakeQueryablePromise(promise);
            return;
        }
        if (this.lock.status === PromiseStatus.pending) {
            this.lock.promise.then(() => this.lock = MakeQueryablePromise(promise));
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

    async createUserProfile(profileName: string, fromProfile?: string) {
        //todo add copy from profile
        const profile = ProfileManager.makeProfileType(profileName, ProfileType.user);
        const presetName = ProfileManager.makePresetName(profileName, ProfileType.user);
        Backend.createProfile(presetName);
        //handle error
        this.profiles[profileName] = profile;
    }

    async createGameProfile(appId: string) {
        try {
            const profile = ProfileManager.makeProfileType(appId, ProfileType.game);
            const presetName = ProfileManager.makePresetName(appId, ProfileType.game);
            const res = await Backend.createProfile(presetName);

            this.profiles[appId] = profile;
            return res;
        } catch (err) {
            return useError(`Problem creating game profile id: ${appId} - \n ${(err as Error).message ?? ''}`);
        }
    }

    private createGlobalProfile() {
        return this.createGameProfile(globalAppId);
    }

    private async createDefaultProfile() {
        try {
            return await Backend.createProfile(defaultPresetName);
        } catch (err) {
            return useError(`Problem creating default profile - \n ${(err as Error).message ?? ''}`);
        }
    }

    async applyProfile(profileId: string, isManuallyApplied: boolean = false) {

        //todo add toast message
        try {
            Log.log('applying profile', profileId);

            const presetName = ProfileManager.makePresetName(profileId, this.profiles[profileId].type);
            const res = await Backend.setProfile(presetName, isManuallyApplied);
            if (isManuallyApplied) this.manualProfileId = profileId;
            Log.log('done waiting for lock')
            this.activeProfileId = profileId;
            return res;
        } catch (err) {
            return useError(`Problem applying profile id: ${profileId} - \n ${(err as Error).message ?? ''}`);
        }
    }

    async saveGameProfile() {

    }

    async setUseManualProfiles(useManual: boolean) {
        try {
            await Backend.setManuallyApplyProfiles(useManual);
            this.manuallyApply = useManual;

            const profileToApply = useManual ? this.manualProfileId : this.watchedGames[getActiveAppId()] ? getActiveAppId() : globalAppId;
            return await this.applyProfile(profileToApply, useManual);
        } catch (err) {
            return useError(`Problem try to set manual profile usage - \n ${(err as Error).message ?? ''}`)
        }
    }

    async setWatchGame(appId: string, watch: boolean) {
        try {
            const res = await Backend.setAppWatch(appId, watch);
            this.watchedGames[appId] = watch;
            return res;
        } catch (err) {
            return useError(`Problem trying to set app watch for appId: ${appId} - \n ${(err as Error).message ?? ''}`);
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
        return { id: profileId, type: isUser ? ProfileType.user : ProfileType.game };
    }

    static makePresetName(id: string, type: ProfileType) {
        switch (type) {
            case ProfileType.game:
                return jdspPresetPrefix + jdspGamePresetIdentifier + id;
            case ProfileType.user:
                return jdspPresetPrefix + jdspUserPresetIndentifier + id;
        }
    }

    static makeProfileType(id: string, type: ProfileType) {
        return type === ProfileType.user ? { id, type: ProfileType.user, get name() { return this.id } } :
            id === globalAppId ? { id, type: ProfileType.game, name: globalProfileName } :
            { id, type: ProfileType.game, get name() { return getAppName(id) } };
    }
}

export enum ProfileType {
    'game',
    'user'
}

export type Profile<Type extends ProfileType> = {
        id: string;
        get name(): string;
        type: Type;
    };

export const profileManager = new ProfileManager();