import logging
import os
import decky_plugin

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