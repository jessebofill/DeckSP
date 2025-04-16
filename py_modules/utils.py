import logging
import os
import subprocess
from typing import List
import decky

from env import env


def get_loggers(jdsp_log_dir, jdsp_log, decky_plugin: decky):
    jdsp_log_dir = os.path.join(decky_plugin.DECKY_PLUGIN_LOG_DIR, "jdsp")
    if not os.path.exists(jdsp_log_dir):
        os.makedirs(jdsp_log_dir)

    jdsp_formatter = logging.Formatter()
    jdsp_handler = logging.FileHandler(jdsp_log)
    jdsp_handler.setFormatter(jdsp_formatter)
    jdsp_logger = logging.getLogger("decksp_jdsp")
    jdsp_logger.setLevel(logging.INFO)
    jdsp_logger.addHandler(jdsp_handler)
    jdsp_logger.propagate = False

    return {"plugin_logger": decky_plugin.logger, "jdsp_logger": jdsp_logger}


def flatpak_CMD(args: List[str], noCheck=False):
    return subprocess.run(args=['flatpak'] + args, check=not noCheck, capture_output=True, text=True, env=env)

def get_xauthority():
    try:
        result = subprocess.run(['systemctl', '--user', 'show-environment'], capture_output=True, text=True, check=True, env=env)
        for line in result.stdout.split("\n"):
            if line.startswith("XAUTHORITY="):
                return line.split("=", 1)[1]
    except subprocess.CalledProcessError as e:
        return
    
def compare_versions(version1, version2):
    def normalize(v):
        return [int(x) for x in v.split(".")]
    
    v1 = normalize(version1)
    v2 = normalize(version2)
    
    for i in range(max(len(v1), len(v2))):
        part_v1 = v1[i] if i < len(v1) else 0
        part_v2 = v2[i] if i < len(v2) else 0
        
        if part_v1 < part_v2:
            return -1
        elif part_v1 > part_v2:
            return 1
    return 0

class SettingDef:
    @classmethod
    def defaults(cls):
        return {
            getattr(cls, attr): getattr(cls.Defaults, attr)
            for attr in dir(cls.Defaults)
            if not attr.startswith("__")
        }