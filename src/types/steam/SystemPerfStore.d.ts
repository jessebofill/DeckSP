interface SystemPerfStore {
    msgState: MsgState;
}

interface MsgState {
    active_profile_game_id: string;
    current_game_id: string;
    limits: unknown;
    settings: unknown;
}