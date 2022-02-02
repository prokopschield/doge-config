import { write } from 'doge-json';

import ConfigField from '../classes/ConfigField';
import readConfig from './readConfig';

export function writeConfig(filepath: string, config: ConfigField) {
    write(filepath, readConfig(config));
}

export default writeConfig;
module.exports = writeConfig;

Object.defineProperties(writeConfig, {
    default: { get: () => writeConfig },
    writeConfig: { get: () => writeConfig },
});
