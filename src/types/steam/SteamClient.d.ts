interface Unregisterable {
    unregister(): void;
}

interface SteamClientUI {
    RegisterForUIModeChanged(callback: (mode: EUIMode) => void): Unregisterable;
}

interface SteamClient {
    Apps: Apps;
    Browser: any;
    BrowserView: any;
    ClientNotifications: any;
    Cloud: any;
    Console: any;
    Downloads: any;
    FamilySharing: any;
    FriendSettings: any;
    Friends: any;
    GameSessions: any;
    Input: any;
    InstallFolder: any;
    Installs: any;
    MachineStorage: any;
    Messaging: any;
    Notifications: any;
    OpenVR: any;
    Overlay: any;
    Parental: any;
    RegisterIFrameNavigatedCallback: any;
    RemotePlay: any;
    RoamingStorage: any;
    Screenshots: any;
    Settings: any;
    SharedConnection: any;
    Stats: any;
    Storage: any;
    Streaming: any;
    System: any;
    UI: SteamClientUI;
    URL: any;
    Updates: any;
    User: any;
    WebChat: any;
    Window: Window;
}


