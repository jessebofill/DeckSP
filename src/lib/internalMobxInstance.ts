import { findModuleExport } from '@decky/ui';
import { PluginManager } from '../controllers/PluginManager';

const res = findModuleExport((e) => e.toString?.().includes("fireImmediately") && e.toString?.().includes("requiresObservable"));
if (!res) PluginManager.addMessage('Could not find mobx.reaction. Some UI elements may not update automatically.')

export namespace InternalMobx {
    export const reaction = (res || (() => { })) as typeof import("mobx").reaction;
}
