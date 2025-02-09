import logging
import os
import subprocess
from typing import List
import decky_plugin

from env import env

def get_loggers(jdsp_log_dir, jdsp_log, decky_plugin: decky_plugin):
    jdsp_log_dir = os.path.join(decky_plugin.DECKY_PLUGIN_LOG_DIR, 'jdsp')
    if not os.path.exists(jdsp_log_dir):
        os.makedirs(jdsp_log_dir)
    
    jdsp_formatter = logging.Formatter()
    jdsp_handler = logging.FileHandler(jdsp_log)  
    jdsp_handler.setFormatter(jdsp_formatter)
    jdsp_logger = logging.getLogger('decksp_jdsp')
    jdsp_logger.setLevel(logging.INFO)
    jdsp_logger.addHandler(jdsp_handler)
    jdsp_logger.propagate = False

    return { 'plugin_logger': decky_plugin.logger, 'jdsp_logger': jdsp_logger}

def flatpak_CMD(args: List[str], noCheck=False):
    return subprocess.run(args=['flatpak'] + args, check=not noCheck, capture_output=True, text=True, env=env)