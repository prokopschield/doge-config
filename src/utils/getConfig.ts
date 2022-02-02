import Config from '../classes/Config';
import normalizeConfigName from './normalizeConfigName';

const configs = new Map<string, Config>();

export function getConfig(name: string, defaults?: object): Config {
    name = normalizeConfigName(name);
    const config = configs.get(name);

    if (config) {
        return config;
    } else {
        const config = new Config(name, defaults);

        configs.set(name, config);

        return config;
    }
}

export default getConfig;
module.exports = getConfig;

Object.defineProperties(getConfig, {
    default: { get: () => getConfig },
    getConfig: { get: () => getConfig },
});
