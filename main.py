import os
import subprocess
from settings import SettingsManager

from env import env
from jdspproxy import JdspProxy
from utils import compare_versions, flatpak_CMD, get_xauthority

# The decky plugin module is located at decky-loader/plugin
# For easy intellisense checkout the decky-loader code one directory up
# or add the `decky-loader/plugin` path to `python.analysis.extraPaths` in `.vscode/settings.json`

import decky

APPLICATION_ID = "me.timschneeberger.jdsp4linux"
JDSP_LOG_DIR =  os.path.join(decky.DECKY_PLUGIN_LOG_DIR, 'jdsp')
JDSP_LOG = os.path.join(JDSP_LOG_DIR, 'jdsp.log')
JDSP_MIN_VER = '2.7.0'

log = decky.logger

settings_manager = SettingsManager(name="settings", settings_directory=os.environ["DECKY_PLUGIN_SETTINGS_DIR"])

default_plugin_settings = {
    'enableInDesktop': False
}

class Plugin:
    jdsp: JdspProxy = None
    jdsp_install_state = False
    profiles = {
        'currentPreset': '',
        'manualPreset': '',
        'useManual': False,
        'watchedApps': {}
    }

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        log.info('Starting plugin backend...')
        if not os.path.exists(JDSP_LOG_DIR):
            os.makedirs(JDSP_LOG_DIR)

        Plugin.load_settings()
        Plugin.jdsp = JdspProxy(APPLICATION_ID, log)

        if(Plugin.handle_jdsp_install()):
            Plugin.jdsp_install_state = True
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

    def load_settings():
        default_profiles_settings = {setting: Plugin.profiles[setting] for setting in Plugin.profiles.keys() - { 'currentPreset' }}
        profiles = settings_manager.getSetting('profiles', default_profiles_settings)
        Plugin.profiles.update(profiles)

    def save_profile_settings():
        settings_manager.setSetting('profiles', {setting: Plugin.profiles[setting] for setting in Plugin.profiles.keys() - { 'currentPreset' }})

    def handle_jdsp_install():
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
        if not Plugin.jdsp_install_state:
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
        for setting in default_plugin_settings:
            settings[setting] = settings_manager.getSetting(setting, default_plugin_settings[setting])
        return settings
    
    # general-frontend-call
    async def set_setting(self, setting, value):
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
        Plugin.profiles['watchedApps'][appId] = watch
        Plugin.save_profile_settings()

    # general-frontend-call
    async def init_profiles(self, globalPreset):
        if Plugin.profiles['manualPreset'] == '':               # manual preset should be set from first loading settings file, if not then file doesn't exist yet
            Plugin.profiles['manualPreset'] = globalPreset
            log.info('No settings file detected. Creating one.')
            Plugin.save_profile_settings()

        presets = Plugin.jdsp.get_presets()
        if JdspProxy.has_error(presets):
            return { 'error': str(presets) }

        return { 
            'manualPreset': Plugin.profiles['manualPreset'], 
            'allPresets': presets['jdsp_result'], 
            'watchedGames': Plugin.profiles['watchedApps'], 
            'manuallyApply': Plugin.profiles['useManual'] 
        }

    # general-frontend-call
    async def set_manually_apply_profiles(self, useManual):
        Plugin.profiles['useManual'] = useManual

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
        res = Plugin.jdsp.set_and_commit(parameter, value)
        if not JdspProxy.has_error(res):
            Plugin.jdsp.save_preset(Plugin.profiles['currentPreset'])
        return res
    
    async def set_jdsp_params(self, values):
        for parameter, value in values:
            res = Plugin.jdsp.set_and_commit(parameter, value)
            if JdspProxy.has_error(res):
                return res
    
        Plugin.jdsp.save_preset(Plugin.profiles['currentPreset'])
        return {'jdsp_result': ''}

    # jdsp-frontend-call
    async def get_all_jdsp_param(self):
        return Plugin.jdsp.get_all()

    # jdsp-frontend-call
    async def set_jdsp_defaults(self, defaultPreset):
        loadres = Plugin.jdsp.load_preset(defaultPreset)                        # load the default preset settings
        if JdspProxy.has_error(loadres): return loadres
        saveres = Plugin.jdsp.save_preset(Plugin.profiles['currentPreset'])     # save the current preset with current settings
        if JdspProxy.has_error(saveres): return saveres
        return Plugin.jdsp.get_all()

    # jdsp-frontend-call
    async def new_jdsp_preset(self, presetName, fromPresetName = None):
        if fromPresetName is not None: 
            loadres = Plugin.jdsp.load_preset(fromPresetName)                   # load preset settings to copy
            if JdspProxy.has_error(loadres): return loadres
            saveres = Plugin.jdsp.save_preset(presetName)                       # save the new preset with current settings
            if JdspProxy.has_error(saveres): return saveres
            return Plugin.jdsp.load_preset(Plugin.profiles['currentPreset'])    # reload the previous preset settings
        else: 
            return Plugin.jdsp.save_preset(presetName)

    # jdsp-frontend-call
    async def delete_jdsp_preset(self, presetName):
        return Plugin.jdsp.delete_preset(presetName)

    # jdsp-frontend-call
    async def set_profile(self, presetName, isManual):
        if isManual:
            Plugin.profiles['manualPreset'] = presetName
        res = Plugin.jdsp.load_preset(presetName)
        if JdspProxy.has_error(res): return res
        
        Plugin.profiles['currentPreset'] = presetName
        Plugin.save_profile_settings()
        return Plugin.jdsp.get_all()
    
    async def create_default_jdsp_preset(self, defaultName):
        config_dir = os.path.expanduser(f'~/.var/app/{APPLICATION_ID}/config/jamesdsp/')

        if not os.path.exists(config_dir):
            log.info('Creating default preset: audio.conf directory was dot detected')
            return Plugin.jdsp.save_preset(defaultName)

        conf_file = os.path.join(config_dir, 'audio.conf')
        temp_conf = os.path.join(config_dir, 'audio_old.conf')

        if os.path.exists(conf_file):
            try:
                os.rename(conf_file, temp_conf)
                await Plugin.start_jdsp(self)

                log.info('Creating default preset: Existing audio.conf detected')
                Plugin.jdsp.save_preset(defaultName)

                if os.path.exists(conf_file):
                    os.remove(conf_file)
                os.rename(temp_conf, conf_file)
                await Plugin.start_jdsp(self)

                return { 'jdsp_result': ''}
            
            except Exception as e:    
                log.error('Error trying to create default preset when audio.conf already existed')
                if isinstance(e, subprocess.CalledProcessError):
                    log.error(e.stderr)
                raise e
        
        else:
            log.info('Creating default preset: No existing audio.conf was detected')
            return Plugin.jdsp.save_preset(defaultName)

    """
    ===================================================================================================================================
    """
