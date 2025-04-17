interface Unregisterable {
    unregister(): void;
};

interface SteamClientUI {
    RegisterForUIModeChanged(callback: (mode: EUIMode) => void): Unregisterable;
};

interface SteamClientInput {
    ControllerKeyboardSendText(textToWrite: string): void;
    ControllerKeyboardSetKeyState(keyIndex: EHIDKeyboardKey, state: boolean): void;
};

type SteamClientUser = {
    RegisterForCurrentUserChanges: (callback: (user: CurrentUser) => void) => Unregisterable;
    RegisterForLoginStateChange: (callback: (accountName: string, loginState: ELoginState, loginResult: number, loginPercentage: number, param4: string) => void) => Unregisterable;
    RegisterForPrepareForSystemSuspendProgress: (callback: (data: any) => void) => Unregisterable;
    RegisterForShutdownStart: (callback: () => void) => Unregisterable;
    RegisterForShutdownDone: (callback: () => void) => Unregisterable;
    StartRestart: () => void;
};

interface SteamClient {
    Apps: any;
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
    Input: SteamClientInput;
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
    User: SteamClientUser;
    WebChat: any;
    Window: Window;
};