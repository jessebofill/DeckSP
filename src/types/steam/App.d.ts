interface App {
    BFinishedInitStageOne(): boolean;
    BHardwareSurveyPending(): CurrentUser['bHWSurveyPending'];
    BHasAckOnlyActiveSupportAlerts(): CurrentUser['bSupportAckOnlyMessages'];
    BHasActiveSupportAlerts(): CurrentUser['bSupportAlertActive'];
    BHasCurrentUser(): boolean;
    BIsFamilyGroupMember(accountid: unknown): boolean;
    BIsInFamilyGroup(): boolean;
    BIsInOOBE(): boolean;
    BIsOfflineMode(): CurrentUser['bIsOfflineMode'];
    BMustShowSupportAlertDialog(): CurrentUser['bSupportPopupMessage'];
    BSupportAlertDialogActive(): App['m_bSupportAlertModalActive'];
    BWasEverLoggedIn(): boolean;
    CloseSupportAlertsModal(): void;
    GetCurrentUser(): CurrentUser;
    GetFamilyGroupID(): CurrentUser['strFamilyGroupID'];
    GetFamilyGroupName(): CurrentUser['strFamilyGroupName'];
    GetServicesInitialized(): boolean;
    Init(e: unknown): Promise<void>;
    InitStage2(): Promise<void>;
    SendSurvey(): void;
    ShowSupportAlertsModal(): void;
    WaitForServicesInitialized(): Promise<boolean>;
    // LoginState: ELoginState;
    cm: ConnectionManager;
    m_bFinishedStage1: boolean;
    m_bHaveShownSupportAlertModal: boolean;
    m_bServicesInitialized: boolean;
    m_bStartedStage2: boolean;
    m_bSupportAlertModalActive: boolean;
    m_bWasEverLoggedIn: boolean;
    m_CurrentUser: CurrentUser;
    // m_eLoginState: ELoginState;
};

interface CurrentUser {
    bHWSurveyPending: boolean;
    bIsLimited: boolean;
    bIsOfflineMode: boolean;
    bPromptToChangePassword: boolean;
    bSupportAckOnlyMessages: boolean;
    bSupportAlertActive: boolean;
    bSupportPopupMessage: boolean;
    strAccountBalance: string;
    strAccountBalancePending: string;
    strAccountName: string;
    strClientInstanceID: string;
    strFamilyGroupID: string;
    strFamilyGroupName?: string;
    strSteamID: string;
};

interface ConnectionManager {
    persona_name: string;
}