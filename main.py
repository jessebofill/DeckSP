import asyncio
import logging
import os
import subprocess
import sys
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

log = decky_plugin.logger


class Plugin:
    jdsp: JdspProxy = None

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        log.info('starting python')
        if not os.path.exists(JDSP_LOG_DIR):
            os.makedirs(JDSP_LOG_DIR)

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

    async def set(self, parameter, value):
        log.info('recieved')
        log.info(parameter)
        log.info(value)
        # p = subprocess.run(['flatpak', '--user', 'run', DBUS_SERVICE, '--set', f'{parameter}={value}'], capture_output=True, text=True)
        # log.info(p)
        return Plugin.jdsp.set_and_commit(parameter, value)
    
    async def set2(self, parameter, value):
        return Plugin.jdsp.set_and_commit(parameter, value)

    async def get_all(self):
        return Plugin.jdsp.get_all()

    async def get_multiple(self, parameters: List[str]):
        result = {}
        for param in parameters:
            result[param] = Plugin.jdsp.get(param)

        return result

    async def get(self, parameter):
        return subprocess.run(['flatpak', '--user', 'run', APPLICATION_ID, '--get', parameter])
        return Plugin.jdsp.get(parameter, log)

    async def test(self):
        log.info("this is a test")
        return os.getuid()