import { write } from 'doge-json';
import readConfig from './readConfig';
import ConfigField from '../classes/ConfigField';

export function writeConfig(filepath: string, config: ConfigField) {
    write(filepath, readConfig(config));
}

export default writeConfig;
module.exports = writeConfig;

Object.defineProperties(writeConfig, {
    default: { get: () => writeConfig },
    writeConfig: { get: () => writeConfig },
});
