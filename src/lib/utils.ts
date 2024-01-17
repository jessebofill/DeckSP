import { SFXPath, GamepadUIAudio } from './GamepadUIAudio';
import { PresetSectionType, PresetTable } from '../types/dspTypes';
import { Log } from './log';

export function playUISound(path: SFXPath) {
    //@ts-ignore
    if (settingsStore?.m_ClientSettings?.enable_ui_sounds) GamepadUIAudio.AudioPlaybackManager.PlayAudioURL(path);
}

export function reverseLookupSectionPreset<PresetType extends PresetSectionType>(presetTable: PresetTable<PresetType>, compareObject: { [key: string]: any }) {
    return Object.keys(presetTable.presets).find(preset => (presetTable.presets[preset] as number[]).every((value, index) => compareObject[presetTable.paramMap[index]] === value));
}

export function getThrottled(func: Function, wait: number) {
    Log.log('getting throttled')
    let timeout: NodeJS.Timeout | null;
    return function (this: any, ..._: any[]) {
        Log.log('calling throt')
        const context = this, args = arguments;
        const later = function () {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout as NodeJS.Timeout);
        timeout = setTimeout(later, wait);
    };
}