import ConfigField from '../classes/ConfigField';
import { ReadObject } from '../types';

export function readConfig(config: ConfigField): ReadObject {
    const returnValue_object: ReadObject = {};

    for (const [key, value] of Object.entries(config)) {
        returnValue_object[key] =
            value instanceof ConfigField
                ? (value.is_array
                    ? Object.values(readConfig(value))
                    : readConfig(value))
                : value;
    }

    return returnValue_object;
}

export default readConfig;
module.exports = readConfig;

Object.defineProperties(readConfig, {
    default: { get: () => readConfig },
    writeConfig: { get: () => readConfig },
});
