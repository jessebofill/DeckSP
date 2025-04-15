import os
import subprocess
from typing import Dict
from EelParser import EELCache, EELParser
from ddc import VdcDbHandler
from extendedsettings import ExtendedSettings
from settings import SettingsManager

from env import env
from jdspproxy import JdspProxy
from utils import compare_versions, flatpak_CMD, get_xauthority

import decky

APPLICATION_ID = "me.timschneeberger.jdsp4linux"
JDSP_LOG_DIR =  os.path.join(decky.DECKY_PLUGIN_LOG_DIR, 'jdsp')
JDSP_LOG = os.path.join(JDSP_LOG_DIR, 'jdsp.log')
JDSP_MIN_VER = '2.7.0'

log = decky.logger

settings_manager = SettingsManager(name="settings", settings_directory=decky.DECKY_PLUGIN_SETTINGS_DIR)
vdc_db_profile_selections = ExtendedSettings(name='vdc-db-profile-selections', settings_directory=decky.DECKY_PLUGIN_SETTINGS_DIR)

default_plugin_settings = {
    'enableInDesktop': False
}

ingore_as_setting = ['profiles', 'eel_param_cache']

class Plugin:
    jdsp: JdspProxy = None
    jdsp_install_state = False
    profiles = {
        'currentPreset': '',
        'manualPreset': '',
        'useManual': False,
        'watchedApps': {}
    }
    eel_cache: Dict[str, EELCache.ScriptCache] = {}
    vdc_handler: VdcDbHandler

    async def _main(self):
        log.info('Starting plugin backend...')
        if not os.path.exists(JDSP_LOG_DIR):
            os.makedirs(JDSP_LOG_DIR)

        self._load_settings()
        self.jdsp = JdspProxy(APPLICATION_ID, log)

        if(self._handle_jdsp_install()):
            self.jdsp_install_state = True
            log.info('Plugin ready')
        else:
            log.error('Problem with JamesDSP installation')


    async def _uninstall(self):
        log.info('Uninstalling plugin...')

        flatpak_CMD(['kill', APPLICATION_ID], noCheck=True)
        try: 
            log.info('Uninstalling JamesDSP...')
            flatpak_CMD(['--user', '-y', 'uninstall', APPLICATION_ID])
            log.info("JamesDSP uninstalled sucessfully")

        except subprocess.CalledProcessError as e:
            log.error('Problem uninstalling JamesDSP')
            log.error(e.stderr)

    async def _unload(self):
        log.info('Unloading plugin...')
        flatpak_CMD(['kill', APPLICATION_ID], noCheck=True)

    def _load_settings(self):
        default_profiles_settings = {setting: self.profiles[setting] for setting in self.profiles.keys() - { 'currentPreset' }}
        profiles = settings_manager.getSetting('profiles', default_profiles_settings)
        self.profiles.update(profiles)
        self._load_eel_cache()
        self.vdc_handler = VdcDbHandler(os.path.join(decky.DECKY_PLUGIN_DIR, 'assets', 'DDCData.json'))

    def _save_profile_settings(self):
        settings_manager.setSetting('profiles', {setting: self.profiles[setting] for setting in self.profiles.keys() - { 'currentPreset' }})

    def _handle_jdsp_install(self):
        try:
            flatpak_CMD(['--user', 'remote-add', '--if-not-exists', 'flathub', 'https://dl.flathub.org/repo/flathub.flatpakrepo'])
        except subprocess.CalledProcessError as e:
            log.info(f'Flatpak remote add {e.stderr.strip()}') #url always fails to resolve and throws an error when booting (doesn't matter). just print all errors, if its an error that matters it will affect the following cmds
        
        log.info('Checking for JamesDSP installation...')
        try:
            flatpakListRes = flatpak_CMD(['list', '--user', '--app', '--columns=application,version'])
            installed_version = ''

            for line in flatpakListRes.stdout.split('\n'):
                if line.startswith(APPLICATION_ID):
                    installed_version = line.split()[1]

            if installed_version != '':
                log.info(f'JamesDSP version {installed_version} is installed')
                
                if compare_versions(installed_version, JDSP_MIN_VER) >= 0: return True
                else: log.info(f'Minimum version is {JDSP_MIN_VER}')
            
            else:
                log.info('No JamesDSP installation was found')
                log.info('Installing JamesDSP flatpak...')
                installRes = flatpak_CMD(['--user', '-y', 'install', 'flathub', APPLICATION_ID])
                log.info(installRes.stdout)
            
            log.info(f'Updating JamesDSP..')
            updateRes = flatpak_CMD(['--user', '-y', 'update', APPLICATION_ID])
            log.info(updateRes.stdout)
            log.info(f'JamesDSP updated')

            return True

        except subprocess.CalledProcessError as e:
            log.error(e.stderr)
            return False

    def _load_eel_cache(self):
        cache = settings_manager.getSetting('eel_param_cache', {})
        update_settings = False
        for path in cache.keys():
            if os.path.exists(path): self.eel_cache[path] = cache[path]
            else: update_settings = True
        if update_settings: settings_manager.setSetting('eel_param_cache', self.eel_cache)

    def _update_eel_cache_and_reload_jdsp(self):
        self.eel_cache[self.eel_parser.path] = self.eel_parser.cache
        settings_manager.setSetting('eel_param_cache', self.eel_cache)
        self.jdsp.set_and_commit('liveprog_file', "")
        self.jdsp.set_and_commit('liveprog_file', self.eel_parser.path)

        
    def _get_jdsp_all_and_apply_vdc_from_db(self, preset_name):
        vdc_path = self.jdsp.get('ddc_file').get('jdsp_result', '').strip()
        if self.vdc_handler.is_proxy_path(vdc_path): # using database proxy file
            self.jdsp.set_and_commit('ddc_file', '')

            selected_vdc_id = vdc_db_profile_selections.getSetting(preset_name)
            if self.vdc_handler.set_and_commit(selected_vdc_id): # vdc id is in database. if this is false empty string is set for the jdsp param
                self.jdsp.set_and_commit('ddc_file', self.vdc_handler._jdsp_proxy_path)
            else: 
                vdc_db_profile_selections.removeSetting(preset_name)
        return self.jdsp.get_all()
        
    """
    ===================================================================================================================================
    FRONTEND CALLED METHODS
    ===================================================================================================================================

    
    ------------------------------------------
    General plugin methods
    ------------------------------------------
    return any value or dictionary with an 'error' property

    Annotation: 'general-frontend-call'
    """

    # general-frontend-call
    async def start_jdsp(self):
        if not self.jdsp_install_state:
            return False
        
        log.info(f'Starting JamesDSP... See process logs at {JDSP_LOG}')
        
        xauth = get_xauthority()
        new_env = env.copy()
        # run without gui
        # new_env['QT_QPA_PLATFORM'] = 'offscreen'
        if xauth: new_env['XAUTHORITY'] = xauth
        flatpak_CMD(['kill', APPLICATION_ID], noCheck=True)
        with open(JDSP_LOG, "w") as jdsp_log:
            subprocess.Popen(f'flatpak --user run {APPLICATION_ID} --tray', stdout=jdsp_log, stderr=jdsp_log, shell=True, env=new_env, universal_newlines=True)
        return True # assume process has started ignoring errors so that the frontend doesn't hang. the jdsp process errors will be logged in its own file

    # general-frontend-call
    async def kill_jdsp(self):
        log.info('Killing JamesDSP')
        flatpak_CMD(['kill', APPLICATION_ID], noCheck=True)

    # general-frontend-call
    async def get_settings(self):
        settings = {}
        for setting in settings_manager.settings:
            if setting in ingore_as_setting:
                continue
            settings[setting] = settings_manager.getSetting(setting, default_plugin_settings.get(setting))
        return settings
    
    # general-frontend-call
    async def set_settings(self, settings):
        for setting, value in settings.items():
            settings_manager.setSetting(setting, value)

    # general-frontend-call
    async def flatpak_repair(self):
        try:
            flatpak_CMD(['repair', '--user'])
            return
        except subprocess.CalledProcessError as e:
            log.error(e.stderr)
            return { 'error': e.stderr }

    # general-frontend-call
    async def set_app_watch(self, appId, watch):
        self.profiles['watchedApps'][appId] = watch
        self._save_profile_settings()

    # general-frontend-call
    async def init_profiles(self, globalPreset):
        if self.profiles['manualPreset'] == '':               # manual preset should be set from first loading settings file, if not then file doesn't exist yet
            self.profiles['manualPreset'] = globalPreset
            log.info('No settings file detected. Creating one.')
            self._save_profile_settings()

        presets = self.jdsp.get_presets()
        if JdspProxy.has_error(presets):
            return { 'error': str(presets) }

        return { 
            'manualPreset': self.profiles['manualPreset'], 
            'allPresets': presets['jdsp_result'], 
            'watchedGames': self.profiles['watchedApps'], 
            'manuallyApply': self.profiles['useManual'] 
        }

    # general-frontend-call
    async def set_manually_apply_profiles(self, useManual):
        self.profiles['useManual'] = useManual
    
    # general-frontend-call
    async def get_eel_params(self, path, profileId):
        if path == '': 
            return []
        self.eel_parser = EELParser(path, self.eel_cache.get(path, {}), profileId)
        if hasattr(self.eel_parser, "error"):
            return { 'error': str(self.eel_parser.error) }
        self._update_eel_cache_and_reload_jdsp()
        return self.eel_parser.parameters
    
    # general-frontend-call
    async def set_eel_param(self, paramName, value):
        self.eel_parser.set_and_commit(paramName, value)
        self._update_eel_cache_and_reload_jdsp()
    
    # general-frontend-call
    async def reset_eel_params(self):
        self.eel_parser.reset_to_defaults()
        self._update_eel_cache_and_reload_jdsp()
    
    # general-frontend-call
    async def set_vdc_db_selection(self, vdcId, presetName): 
        jdsp_error = JdspProxy.has_error(await self.set_jdsp_param('ddc_file', ''))
        if jdsp_error: return { 'error': 'Failed setting jdsp ddc_file empty for reload'}
            
        if self.vdc_handler.set_and_commit(vdcId):
            jdsp_error = JdspProxy.has_error(await self.set_jdsp_param('ddc_file', self.vdc_handler._jdsp_proxy_path))
            if jdsp_error: return { 'error': 'Failed reloading jdsp ddc_file'}
            vdc_db_profile_selections.setSetting(presetName, vdcId)
        else: 
            vdc_db_profile_selections.removeSetting(presetName)
            return { 'error': f'Could not find vdc id: {vdcId} in the database' }
    
    # general-frontend-call
    async def get_vdc_db_selections(self):
        return vdc_db_profile_selections.settings
        
    # general-frontend-call
    async def get_static_data(self):
        return { 'vdcDb': self.vdc_handler.get_db() }
    
    """
    ------------------------------------------
    JDSP specific methods
    ------------------------------------------
    return a JamesDSP cli result in a dictionary in the format of either...
    { 'jdsp_result': str } or { 'jdsp_error': str }

    Annotation: 'jdsp-frontend-call'
    """

    # jdsp-frontend-call
    async def set_jdsp_param(self, parameter, value):
        res = self.jdsp.set_and_commit(parameter, value)
        if not JdspProxy.has_error(res):
            self.jdsp.save_preset(self.profiles['currentPreset'])
        return res
    
    # jdsp-frontend-call
    async def set_jdsp_params(self, values):
        for parameter, value in values:
            res = self.jdsp.set_and_commit(parameter, value)
            if JdspProxy.has_error(res):
                return res
    
        self.jdsp.save_preset(self.profiles['currentPreset'])
        return {'jdsp_result': ''}

    # jdsp-frontend-call
    async def get_all_jdsp_param(self):
        return self._get_jdsp_all_and_apply_vdc_from_db(self.profiles['currentPreset'])

    # jdsp-frontend-call
    async def set_jdsp_defaults(self, defaultPreset):
        loadres = self.jdsp.load_preset(defaultPreset)                        # load the default preset settings
        if JdspProxy.has_error(loadres): return loadres
        saveres = self.jdsp.save_preset(self.profiles['currentPreset'])     # save the current preset with current settings
        if JdspProxy.has_error(saveres): return saveres
        return self.jdsp.get_all()

    # jdsp-frontend-call
    async def new_jdsp_preset(self, presetName, fromPresetName = None):
        if fromPresetName is not None: 
            loadres = self.jdsp.load_preset(fromPresetName)                   # load preset settings to copy
            if JdspProxy.has_error(loadres): return loadres
            saveres = self.jdsp.save_preset(presetName)                       # save the new preset with current settings
            if JdspProxy.has_error(saveres): return saveres
            return self.jdsp.load_preset(self.profiles['currentPreset'])    # reload the previous preset settings
        else: 
            return self.jdsp.save_preset(presetName)

    # jdsp-frontend-call
    async def delete_jdsp_preset(self, presetName):
        vdc_db_profile_selections.removeSetting(presetName)
        return self.jdsp.delete_preset(presetName)

    # jdsp-frontend-call
    async def set_profile(self, presetName, isManual):
        if isManual:
            self.profiles['manualPreset'] = presetName
        res = self.jdsp.load_preset(presetName)
        if JdspProxy.has_error(res): return res
        
        self.profiles['currentPreset'] = presetName
        self._save_profile_settings()
        return self._get_jdsp_all_and_apply_vdc_from_db(presetName)
    
    # jdsp-frontend-call
    async def create_default_jdsp_preset(self, defaultName):
        config_dir = os.path.expanduser(f'~/.var/app/{APPLICATION_ID}/config/jamesdsp/')

        if not os.path.exists(config_dir):
            log.info('Creating default preset: audio.conf directory was dot detected')
            return self.jdsp.save_preset(defaultName)

        conf_file = os.path.join(config_dir, 'audio.conf')
        temp_conf = os.path.join(config_dir, 'audio_old.conf')

        if os.path.exists(conf_file):
            try:
                os.rename(conf_file, temp_conf)
                await self.start_jdsp(self)

                log.info('Creating default preset: Existing audio.conf detected')
                self.jdsp.save_preset(defaultName)

                if os.path.exists(conf_file):
                    os.remove(conf_file)
                os.rename(temp_conf, conf_file)
                await self.start_jdsp(self)

                return { 'jdsp_result': ''}
            
            except Exception as e:    
                log.error('Error trying to create default preset when audio.conf already existed')
                if isinstance(e, subprocess.CalledProcessError):
                    log.error(e.stderr)
                raise e
        
        else:
            log.info('Creating default preset: No existing audio.conf was detected')
            return self.jdsp.save_preset(defaultName)

    """
    ===================================================================================================================================
    """
