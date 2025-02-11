import os
import subprocess
from settings import SettingsManager

from env import env
from jdspproxy import JdspProxy
from utils import flatpak_CMD

# The decky plugin module is located at decky-loader/plugin
# For easy intellisense checkout the decky-loader code one directory up
# or add the `decky-loader/plugin` path to `python.analysis.extraPaths` in `.vscode/settings.json`

import decky

APPLICATION_ID = "me.timschneeberger.jdsp4linux"
DBUS_PATH = "/jdsp4linux/service"
DBUS_INTERFACE = "me.timschneeberger.jdsp4linux.Service"
FLATPAK_PATH = 'defaults/jdsp4linux-headless.flatpak'
JDSP_LOG_DIR =  os.path.join(decky.DECKY_PLUGIN_LOG_DIR, 'jdsp')
JDSP_LOG = os.path.join(JDSP_LOG_DIR, 'jdsp.log')
JDSP_REQ_VER = '2.6.1'

jdspPresetPrefix = 'decksp.'
jdspPresetGamePrefix = jdspPresetPrefix + 'game:'
jdspPresetUserPrefix = jdspPresetPrefix + 'user:'

log = decky.logger

settings_manager = SettingsManager(name="settings", settings_directory=os.environ["DECKY_PLUGIN_SETTINGS_DIR"])

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
            log.error('Problem with James DSP installation')


    async def _uninstall(self):
        log.info('Uninstalling plugin...')

        flatpak_CMD(['kill', APPLICATION_ID], noCheck=True)
        try: 
            log.info('Uninstalling James DSP...')
            flatpak_CMD(['--user', '-y', 'uninstall', APPLICATION_ID])
            log.info("James DSP uninstalled sucessfully")

        except subprocess.CalledProcessError as e:
            log.error('Problem uninstalling James DSP')
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
        log.info('Checking for James DSP installation...')
        try:
            flatpakListRes = flatpak_CMD(['list', '--app', '--columns=application,version'])
            installed_version = ''

            for line in flatpakListRes.stdout.split('\n'):
                if line.startswith(APPLICATION_ID):
                    installed_version = line.split()[1]

            if installed_version != '':
                log.info(f'James DSP version {installed_version} is installed')
                
                if installed_version == JDSP_REQ_VER: return True
                else: log.info(f'Required version is {JDSP_REQ_VER}')
            
            else:
                log.info('No James DSP installation was found')
                log.info('Installing James DSP flatpak...')
                installRes = flatpak_CMD(['--user', '-y', 'install', 'flathub', APPLICATION_ID])
                log.info(installRes.stdout)
            
            log.info(f'Installing required version {JDSP_REQ_VER}...')
            updateRes = flatpak_CMD(['--user', '-y', 'update', '--commit=892695e011c19fc04de20973cb1c6b639753ed76084a170a966c61a64037ab9c', APPLICATION_ID])
            log.info(updateRes.stdout)
            log.info(f'Installed James DSP version {JDSP_REQ_VER}')

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

        flatpak_CMD(['kill', APPLICATION_ID], noCheck=True)
        with open(JDSP_LOG, "w") as jdsp_log:
            subprocess.Popen(f'flatpak --user run {APPLICATION_ID} --tray', stdout=jdsp_log, stderr=jdsp_log, shell=True, env=env, universal_newlines=True)
        return True # assume process has started ignoring errors so that the frontend doesn't hang. the jdsp process errors will be logged in its own file

    # general-frontend-call
    async def flatpak_repair(self):
        try:
            flatpak_CMD(['repair', '--user'])
            return
        except subprocess.CalledProcessError as e:
            return { 'error': e.stderr }

    # general-frontend-call
    async def set_app_watch(self, appId, watch):
        Plugin.profiles['watchedApps'][appId] = watch
        Plugin.save_profile_settings()

    # general-frontend-call
    async def init_profiles(self, globalPreset):
        if Plugin.profiles['manualPreset'] == '':               # manual preset should be set from first loading settings file, if not then file doesn't exist yet
            Plugin.profiles['manualPreset'] = globalPreset
            log.info('No settings file detected. Creating a new one.')
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
    return a James DSP cli result in a dictionary in the format of either...
    { 'jdsp_result': str } or { 'jdsp_error': str }

    Annotation: 'jdsp-frontend-call'
    """

    # jdsp-frontend-call
    async def set_jdsp_param(self, parameter, value):
        # log.info('recieved')
        # log.info(parameter)
        # log.info(value)
        # p = subprocess.run(['flatpak', '--user', 'run', DBUS_SERVICE, '--set', f'{parameter}={value}'], capture_output=True, text=True)
        # log.info(p)
        res = Plugin.jdsp.set_and_commit(parameter, value)
        Plugin.jdsp.save_preset(Plugin.profiles['currentPreset'])
        # check errors
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
        Plugin.jdsp.load_preset(presetName)
        # check errors
        Plugin.profiles['currentPreset'] = presetName
        Plugin.save_profile_settings()
        return Plugin.jdsp.get_all()

    async def test(self):
        log.info("this is a test")
        return os.getuid()

    async def test2(self):
        return Plugin.profiles

    """
    ===================================================================================================================================
    """
