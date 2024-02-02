import { SteamAppOverview } from 'decky-frontend-lib';

type AppStore = {
    GetAppOverviewByAppID: (appId: number) => AppOverview | undefined;
    GetIconURLForApp: (appOverview: SteamAppOverview) => string;
};