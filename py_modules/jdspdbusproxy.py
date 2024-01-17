import os
import sys
import subprocess

#for testing
sys.path.append(os.path.dirname(__file__))
DBUS_SERVICE = "me.timschneeberger.jdsp4linux"


from dbuss import DBus

class JdspDbusProxy:

    def __init__(self, dbus: DBus):
        self.dbus = dbus
        self.env = os.environ.copy()
        self.env["DBUS_SESSION_BUS_ADDRESS"] = f'unix:path=/run/user/{os.getuid()}/bus'
        # self.env["PATH"] += ':/home/deck/.local/share/flatpak/exports/bin:/var/lib/flatpak/exports/bin'
        # self.env["XDG_DATA_DIRS"] += ':/home/deck/.local/share/flatpak/exports/share'
        # self.env['XDG_RUNTIME_DIR']='/run/user/1000'
        # self.env['DISPLAY']=':0'
        # self.env['MOZ_ENABLE_WAYLAND']='1'


    # def setAndCommit(self, key, value, logger):
    #     return self.dbus.send('setAndCommit', logger, f'string:{key}', f'variant:string:{value}')
    
    # def get(self, key, logger):
    #     return self.dbus.send('get', logger, f'string:{key}')
    
    def setAndCommit(self, key, value, logger):

        p = subprocess.run(['flatpak', '--user', 'run', DBUS_SERVICE, '--set', f'{key}={value}'], capture_output=True, text=True, env=self.env)
        logger.info(p)
        return { 'res': p.stdout, 'e': p.stderr }
    
    def get(self, key, logger):
        p = subprocess.run(['flatpak', '--user', 'run', DBUS_SERVICE, '--get', f'{key}'], capture_output=True, text=True, env=self.env)
        logger.info(p)
        return { 'res': p.stdout., 'e': p.stderr }

    def getAll(self, logger):
        p = subprocess.run(['flatpak', '--user', 'run', DBUS_SERVICE, '--get-all'], capture_output=True, text=True, env=self.env)
        logger.info(p)
        return { 'res': p.stdout, 'e': p.stderr }