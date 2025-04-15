from settings import SettingsManager
class ExtendedSettings(SettingsManager):
    def removeSetting(self, key):
        if self.settings.get(key):
            del self.settings[key]
            self.commit()