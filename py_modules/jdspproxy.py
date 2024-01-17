import os
import sys
import subprocess

class JdspProxy:

    def __init__(self, app_id, decky_logger):
        self.app_id = app_id
        self.log = decky_logger
        self.env = os.environ.copy()
        self.env["DBUS_SESSION_BUS_ADDRESS"] = f'unix:path=/run/user/{os.getuid()}/bus'

    # def setAndCommit(self, key, value, logger):
    #     return self.dbus.send('setAndCommit', logger, f'string:{key}', f'variant:string:{value}')
    
    # def get(self, key, logger):
    #     return self.dbus.send('get', logger, f'string:{key}')
    
    def __run(self, command, *args):
        try:
            return {'jdsp_result': subprocess.run(['flatpak', '--user', 'run', self.app_id, command, *args], check=True, capture_output=True, text=True, env=self.env).stdout}
        except subprocess.CalledProcessError as e:
            self.log.error(e)
            return {'jdsp_error': e.stderr}

    def set_and_commit(self, key, value):
        return self.__run('--set', f'{key}={value}')
    
    def get(self, key):
        return self.__run('--get', f'{key}')

    def get_all(self):
        return self.__run('--get-all')