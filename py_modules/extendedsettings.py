from typing import Any, Dict
from settings import SettingsManager
class ExtendedSettings(SettingsManager):
    def removeSetting(self, key):
        if self.settings.get(key):
            del self.settings[key]
            self.commit()
    
    def setMultipleSettings(self, settings: Dict[str, Any]):    
        for setting, value in settings.items():
            self.settings[setting] = value
        self.commit()
        
    def setDefaults(self, settings: Dict[str, Any]):    
        commit = False  # Flag to track if any new keys were added
        for setting, value in settings.items():
            if setting not in self.settings:  # Only set if the key doesn't already exist
                self.settings[setting] = value
                commit = True  # Mark that a new key was added
        if commit:  # Only commit if at least one new key was added
            self.commit()