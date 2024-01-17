import os
import subprocess

class DBus():

    def __init__(self, service, path, interface):
        self.service = service
        self.path = path
        self.interface = interface
        env = os.environ.copy()
        env["DBUS_SESSION_BUS_ADDRESS"] = f'unix:path=/run/user/{os.getuid()}/bus'
        self.env = env

    def send(self, command, logger, *parameters):
        res = subprocess.Popen(f"dbus-send --print-reply --dest={self.service} {self.path} {self.interface}.{command} \
            {' '.join(parameters)}", stdout=subprocess.PIPE, shell=True, env=self.env, universal_newlines=True).communicate()[0]
        logger.info('send was called')
        logger.info(res)
        logger.info(type(res))    
        return res
    
    def _get_dbus_env(self):
        env = os.environ.copy()
        env["DBUS_SESSION_BUS_ADDRESS"] = f'unix:path=/run/user/{os.getuid()}/bus'
        return env
