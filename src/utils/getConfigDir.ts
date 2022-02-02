import { ConfigDir } from '../classes/ConfigDir';
import normalizeConfigName from './normalizeConfigName';

const configs = new Map<string, ConfigDir>();

export function getConfigDir(name: string, defaults?: object): ConfigDir {
    name = normalizeConfigName(name);
    const config = configs.get(name);

    if (config) {
        return config;
    } else {
        const config = new ConfigDir(name, defaults);

        configs.set(name, config);

        return config;
    }
}

export default getConfigDir;
module.exports = getConfigDir;

Object.defineProperties(getConfigDir, {
    default: { get: () => getConfigDir },
    getConfigDir: { get: () => getConfigDir },
});
