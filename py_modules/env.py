import os

env = os.environ.copy()
env["DBUS_SESSION_BUS_ADDRESS"] = f'unix:path=/run/user/{os.getuid()}/bus'
env['XDG_RUNTIME_DIR']=f'/run/user/{os.getuid()}'
env['DISPLAY']=':0'
env.pop('LD_LIBRARY_PATH', None)