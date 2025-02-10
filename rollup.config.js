import deckyPlugin from "@decky/rollup";
import replace from '@rollup/plugin-replace';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { name } = require('./plugin.json');

export default deckyPlugin({
    plugins: [
        replace({ 'PLUGIN-NAME': name })
    ]
});
