import subprocess
from env import env

JDSP_ERROR_STR = 'jdsp_error'

class JdspProxy:

    def __init__(self, app_id, decky_logger):
        self.app_id = app_id
        self.log = decky_logger

    def __run(self, command, *args):
        try:
            result = subprocess.run(['flatpak', '--user', 'run', self.app_id, '-c', command, *args], check=True, capture_output=True, text=True, env=env)
            return JdspProxy.wrap_process_result(result)
        
        except subprocess.CalledProcessError as e:
            return JdspProxy.wrap_process_result(e)
        
    @staticmethod
    def wrap_process_result(result: subprocess.CompletedProcess[str] | subprocess.CalledProcessError):
        if result.stderr != '':
            msg = result.stderr
            if result.stderr.startswith("error:"):
                msg = result.stderr[len("error:"):].strip()
            return {JDSP_ERROR_STR: msg}
            
        return {'jdsp_result': result.stdout}

    @staticmethod
    def has_error(result: dict[str]):
        if JDSP_ERROR_STR in result:
            return True
        else:
            return False

    def set_and_commit(self, key, value):
        return self.__run('--set', f'{key}={value}')

    def get(self, key):
        return self.__run('--get', f'{key}')

    def get_all(self):
        return self.__run('--get-all')

    def load_preset(self, presetName):
        return self.__run('--load-preset', presetName)

    def save_preset(self, presetName):
        return self.__run('--save-preset', presetName)

    def delete_preset(self, presetName):
        return self.__run('--delete-preset', presetName)

    def get_presets(self):
        return self.__run('--list-presets')
