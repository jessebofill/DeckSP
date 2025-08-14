import { findModuleChild } from '@decky/ui';
import { PluginManager } from '../controllers/PluginManager';

const mobxReactionFilter = (mod: any) => {
  if (typeof mod !== "object") return;

  for (const val of Object.values(mod as object)) {
    if (
      val?.length === 3 &&
      val?.toString?.().includes("fireImmediately") &&
      val?.toString?.().includes("requiresObservable")
    ) {
      return val;
    }
  }
};

const res = findModuleChild(mobxReactionFilter);
if (!res) PluginManager.addMessage('Could not find mobx.reaction. Some UI elements may not update automatically.')

export namespace InternalMobx {
    export const reaction = (res || (() => {})) as typeof import("mobx").reaction;
}
