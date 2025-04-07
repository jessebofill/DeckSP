
interface FocusNavController {
    m_rgGamepadInputSources?: GamepadInputSource[];
    m_rgAllContexts: Context[];
    GetActiveContext: () => Context;
    GetDefaultContext: () => Context;
}

interface GamepadInputSource {
    m_ButtonRepeatHandler?: ButtonRepeatHandler;
    Reset?: () => void;
}
interface ButtonRepeatHandler {
    m_inputRepeatGenerator?: InputRepeatGenerator;
    Reset?: () => void;
}

interface InputRepeatGenerator {
    m_ActiveInputId?: number
    Reset?: () => void;
}

interface Context {
    RootWindow: Window;
}
