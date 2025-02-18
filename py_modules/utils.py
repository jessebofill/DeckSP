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