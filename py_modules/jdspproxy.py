import subprocess
from env import env

JDSP_ERROR_KEY = 'jdsp_error'
JDSP_RESULT_KEY = 'jdsp_result'

class JdspProxy:

    def __init__(self, app_id, decky_logger):
        self.app_id = app_id
        self.log = decky_logger

    def __run(self, command, *args):
        try:
            result = subprocess.run(['flatpak', '--user', 'run', self.app_id, '-c', command, *args], check=True, capture_output=True, text=True, env=env)
            return self._wrap_process_result(result)
        
        except subprocess.CalledProcessError as e:
            return self._wrap_process_result(e)
        

    def _wrap_process_result(self, result: subprocess.CompletedProcess[str] | subprocess.CalledProcessError):
        if result.stderr != '':
            msg = result.stderr
            if result.stderr.startswith("error:"):
                msg = result.stderr[len("error:"):].strip()
            return JdspProxy.wrap_error_result(msg)
            
        return JdspProxy.wrap_success_result(result.stdout)
    
    @staticmethod
    def wrap_success_result(result):
        return {JDSP_RESULT_KEY: result}
    
    @staticmethod
    def wrap_error_result(result):
        return {JDSP_ERROR_KEY: result}
    
    @staticmethod
    def unwrap(result) -> str:
        if JDSP_RESULT_KEY in result:
            return result[JDSP_RESULT_KEY]
        return result.get(JDSP_ERROR_KEY)

    @staticmethod
    def has_error(result: dict[str]):
        if JDSP_ERROR_KEY in result:
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
    
    def rename_preset(self, current_name, new_name):
        """This loads other presets. Save and reload the current preset after using if necessary"""
        load_res = self.load_preset(current_name)
        if self.has_error(load_res):
            return JdspProxy.wrap_error_result(f'Rename failed at load - {JdspProxy.unwrap(load_res)}')
        
        save_res = self.save_preset(new_name)
        if self.has_error(save_res):
            return JdspProxy.wrap_error_result(f'Rename failed at save - {JdspProxy.unwrap(save_res)}')
        
        delete_res = self.delete_preset(current_name)
        if self.has_error(delete_res):
            return JdspProxy.wrap_error_result(f'Rename failed at delete - {JdspProxy.unwrap(delete_res)}')
        
        return JdspProxy.wrap_success_result('')
