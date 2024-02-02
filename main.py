import asyncio
import logging
import os
import subprocess
import sys
from settings import SettingsManager
from typing import List

#for testing?
sys.path.append(os.path.dirname(__file__))

from py_modules.jdspproxy import JdspProxy
from py_modules.dbuss import DBus

# The decky plugin module is located at decky-loader/plugin
# For easy intellisense checkout the decky-loader code one directory up
# or add the `decky-loader/plugin` path to `python.analysis.extraPaths` in `.vscode/settings.json`

import decky_plugin

APPLICATION_ID = "me.timschneeberger.jdsp4linux"
DBUS_PATH = "/jdsp4linux/service"
DBUS_INTERFACE = "me.timschneeberger.jdsp4linux.Service"
FLATPAK_PATH = 'defaults/jdsp4linux-headless.flatpak'
JDSP_LOG_DIR =  os.path.join(decky_plugin.DECKY_PLUGIN_LOG_DIR, 'jdsp')
JDSP_LOG = os.path.join(JDSP_LOG_DIR, 'jdsp.log')

jdspPresetPrefix = 'decksp.'
jdspPresetGamePrefix = jdspPresetPrefix + 'game:'
jdspPresetUserPrefix = jdspPresetPrefix + 'user:'

log = decky_plugin.logger

settings_manager = SettingsManager(name="settings", settings_directory=os.environ["DECKY_PLUGIN_SETTINGS_DIR"])

class Plugin:
    jdsp: JdspProxy = None
    profiles = {
        'currentPreset': '',
        'manualPreset': '',
        'useManual': False,
        'watchedApps': {}
    }

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        log.info('starting python')
        if not os.path.exists(JDSP_LOG_DIR):
            os.makedirs(JDSP_LOG_DIR)

        Plugin.load_settings()

        #install flatpak and change to correct version
        #ADD ERROR CHECKING HERE
        subprocess.run(['flatpak', '--user', '-y', 'install', 'flathub', APPLICATION_ID])
        subprocess.run(['flatpak', '--user', '-y', 'update', '--commit=892695e011c19fc04de20973cb1c6b639753ed76084a170a966c61a64037ab9c', APPLICATION_ID], capture_output=True, text=True)
        log.info('flatpak installed')
        
        # dbus = DBus(APPLICATION_ID, DBUS_PATH, DBUS_INTERFACE)
        Plugin.jdsp = JdspProxy(APPLICATION_ID, log)
        log.info('Plugin ready')


    async def start_jdsp(self):
        env = os.environ.copy()
        env["DBUS_SESSION_BUS_ADDRESS"] = f'unix:path=/run/user/{os.getuid()}/bus'
        env['XDG_RUNTIME_DIR']=f'/run/user/{os.getuid()}'
        env['DISPLAY']=':0'


        # process = await asyncio.create_subprocess_shell('flatpak kill ' + APPLICATION_ID, env=env)
        # await process.wait()

        # # Start the flatpak application
        # cmd = f'flatpak --user run {APPLICATION_ID} --tray'
        # asyncio.create_subprocess_shell(cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE, env=env)
        # # stdout, stderr = await process.communicate()

        subprocess.run(['flatpak', 'kill', APPLICATION_ID], env=env)
        with open(JDSP_LOG, "w") as jdsp_log:
            subprocess.Popen(f'flatpak --user run {APPLICATION_ID} --tray', stdout=jdsp_log, stderr=jdsp_log, shell=True, env=env, universal_newlines=True)


    # Function called first during the unload process, utilize this to handle your plugin being removed
    async def _unload(self):
        env = os.environ.copy()
        env["DBUS_SESSION_BUS_ADDRESS"] = f'unix:path=/run/user/{os.getuid()}/bus'
        env['XDG_RUNTIME_DIR']=f'/run/user/{os.getuid()}'
        env['DISPLAY']=':0'

        subprocess.run(['flatpak', 'kill', APPLICATION_ID], env=env)
        subprocess.run(['flatpak', '--user', '-y', 'uninstall', APPLICATION_ID])
        log.info("Uninstalled James DSP")

    # Migrations that should be performed before entering `_main()`.
    async def migration(self):
        log.info("Migrating")
        # Here's a migration example for logs:
        # - `~/.config/decky-template/template.log` will be migrated to `decky_plugin.DECKY_PLUGIN_LOG_DIR/template.log`
        decky_plugin.migrate_logs(
            os.path.join(
                decky_plugin.DECKY_USER_HOME,
                ".config",
                "decky-template",
                "template.log",
            )
        )
        # Here's a migration example for settings:
        # - `~/homebrew/settings/template.json` is migrated to `decky_plugin.DECKY_PLUGIN_SETTINGS_DIR/template.json`
        # - `~/.config/decky-template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_SETTINGS_DIR/`
        decky_plugin.migrate_settings(
            os.path.join(decky_plugin.DECKY_HOME, "settings", "template.json"),
            os.path.join(decky_plugin.DECKY_USER_HOME, ".config", "decky-template"),
        )
        # Here's a migration example for runtime data:
        # - `~/homebrew/template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_RUNTIME_DIR/`
        # - `~/.local/share/decky-template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_RUNTIME_DIR/`
        decky_plugin.migrate_runtime(
            os.path.join(decky_plugin.DECKY_HOME, "template"),
            os.path.join(
                decky_plugin.DECKY_USER_HOME, ".local", "share", "decky-template"
            ),
        )

    async def set_jdsp_param(self, parameter, value):
        log.info('recieved')
        log.info(parameter)
        log.info(value)
        # p = subprocess.run(['flatpak', '--user', 'run', DBUS_SERVICE, '--set', f'{parameter}={value}'], capture_output=True, text=True)
        # log.info(p)
        res = Plugin.jdsp.set_and_commit(parameter, value)
        Plugin.jdsp.save_preset(Plugin.profiles['currentPreset'])
        #check errors
        return res 
    
    async def set2(self, parameter, value):
        return Plugin.jdsp.set_and_commit(parameter, value)

    async def get_all_jdsp_param(self):
        return Plugin.jdsp.get_all()

    # async def get_multiple(self, parameters: List[str]):
    #     result = {}
    #     for param in parameters:
    #         result[param] = Plugin.jdsp.get(param)

    #     return result

    # async def get(self, parameter):
    #     return subprocess.run(['flatpak', '--user', 'run', APPLICATION_ID, '--get', parameter])
    #     return Plugin.jdsp.get(parameter, log)

    async def test(self):
        log.info("this is a test")
        return os.getuid()
    
    async def test2(self):
        return Plugin.profiles
    
    async def new_preset(self, presetName, fromPresetName = None):
        if fromPresetName is not None: 
            load1res = Plugin.jdsp.load_preset(fromPresetName)
            if Plugin.jdsp.has_error(load1res): return load1res
            saveres = Plugin.jdsp.save_preset(presetName)
            if Plugin.jdsp.has_error(saveres): return saveres
            return Plugin.jdsp.load_preset(Plugin.profiles['currentPreset'])
        else: 
            return Plugin.jdsp.save_preset(presetName)

    # async def make_default_profile(self, defaultName):
    #     Plugin.jdsp.save_preset()
    #     return Plugin.jdsp.get_all()
    
    async def set_profile(self, presetName, isManual):
        if isManual:
            Plugin.profiles['manualPreset'] = presetName
        Plugin.jdsp.load_preset(presetName)
        # check errors
        Plugin.profiles['currentPreset'] = presetName
        Plugin.save_profile_settings()
        return Plugin.jdsp.get_all()
    
    # async def get_profiles(self):
    #     return Plugin.jdsp.get_presets()
    
    async def set_app_watch(self, appId, watch):
        Plugin.profiles['watchedApps'][appId] = watch
        Plugin.save_profile_settings()

    async def init_profiles(self, globalPreset):
        if Plugin.profiles['manualPreset'] == '':
            Plugin.profiles['manualPreset'] = globalPreset
            Plugin.save_profile_settings()

        presets = Plugin.jdsp.get_presets()
        if JdspProxy.has_error(presets):
            return { 'error': presets['jdsp_error'] }
        
        return { 
            'manualPreset': Plugin.profiles['manualPreset'], 
            'allPresets': presets['jdsp_result'], 
            'watchedGames': Plugin.profiles['watchedApps'], 
            'manuallyApply': Plugin.profiles['useManual'] 
        }

    async def set_manually_apply_profiles(self, useManual):
        Plugin.profiles['useManual'] = useManual

    def load_settings():
        log.info('load settings')
        default_profiles_settings = {setting: Plugin.profiles[setting] for setting in Plugin.profiles.keys() - { 'currentPreset' }}
        setting = settings_manager.getSetting('profiles', default_profiles_settings)
        Plugin.profiles.update(setting)
        log.info(setting)
    
    def save_profile_settings():
        log.info('saving profile')
        log.info(Plugin.profiles)
        settings_manager.setSetting('profiles', {setting: Plugin.profiles[setting] for setting in Plugin.profiles.keys() - { 'currentPreset' }})