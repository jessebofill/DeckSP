import json
import decky

class VdcDbHandler:
    def __init__(self, db_path):
        try:
            with open(db_path, "r") as file:
                self._data = json.loads(file.read())
        except OSError as e:
            decky.logger.error(f"Error reading vdc database file {db_path}: {e}")
            raise e
        except json.JSONDecodeError as e:
            decky.logger.error(f"Error decoding JSON from file {db_path}: {e}")
            raise e
        
        self._jdsp_proxy_path = '/home/deck/.var/app/me.timschneeberger.jdsp4linux/config/jamesdsp/temp.vdc'
        self.profile_selections = {}

    def get_db(self):
        return self._data
    
    def is_proxy_path(self, path):
        return path == self._jdsp_proxy_path
    
    def set_and_commit(self, id):
        index = self._find_index(id)
        if index is None:
            return False
        self._write(self._compose_vdc_file(index))
        return True

    def _write(self, data):
        try:
            with open(self._jdsp_proxy_path, "w") as file:
                file.write(data)
        except OSError as e:
            decky.logger.error(f"Error writing file {self._jdsp_proxy_path}: {e}")

    def _compose_vdc_file(self, index):
        sr_44100_coeffs = self._coefficients(index, 44100)
        sr_48000_coeffs = self._coefficients(index, 48000)
        
        vdc = f"SR_44100:{sr_44100_coeffs}\nSR_48000:{sr_48000_coeffs}"
        return vdc

    def _coefficients(self, index, srate):
        return self._data[index].get(f"SR_{srate}_Coeffs", "")

    def _find_index(self, id):
        for index, entry in enumerate(self._data):
            if entry.get("ID") == id:
                return index
        return None