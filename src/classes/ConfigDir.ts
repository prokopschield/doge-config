import { fs } from 'doge-json';
import path from 'path';
import { UnknownObject } from '../types';
import normalizeConfigName from '../utils/normalizeConfigName';
import Config from './Config';

export interface ConfigDir {
    [name: string]: Config;
}

export class ConfigDir {
    constructor(name: string, defaults?: object, confdir: string = 'config') {
        const full_path = path.resolve(confdir, name);
        const configs: {
            [name: string]: Config;
        } = {};
        const getConfig = (name: string) => {
            const normalized = normalizeConfigName(name);
            if (configs[normalized]) {
                return configs[normalized];
            } else {
                return (configs[normalized] = new Config(
                    normalized,
                    defaults,
                    full_path
                ));
            }
        };
        const proxy: ConfigDir = new Proxy(this, {
            get(_target, key: string) {
                return getConfig(key);
            },
            has(_target, key: string) {
                key = normalizeConfigName(key);
                return (
                    key in configs ||
                    fs.existsSync(path.resolve(full_path, `${key}.json`))
                );
            },
            set(_target, key: string, value: UnknownObject) {
                if (typeof value === 'object') {
                    const config = getConfig(key.toString());
                    for (const [key, val] of Object.entries(value)) {
                        config.__set(key, val);
                    }
                } else {
                    getConfig('data').__set(key, value);
                }
                return true;
            },
        });
        return proxy;
    }
}

export default module.exports = ConfigDir;

Object.defineProperties(ConfigDir, {
    default: { get: () => ConfigDir },
    ConfigDir: { get: () => ConfigDir },
});
