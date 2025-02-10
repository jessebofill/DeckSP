import { SteamAppOverview } from '@decky/ui';

type AppStore = {
    GetAppOverviewByAppID: (appId: number) => AppOverview | undefined;
    GetIconURLForApp: (appOverview: SteamAppOverview) => string;
};