import { Config } from './Config';
import { normalizeConfigName } from './normalizeConfigName';

const configs = new Map<string, Config>();

export function getConfig (name: string) {
	name = normalizeConfigName(name)
	if (configs.has(name)) {
		return configs.get(name);
	} else {
		const config = new Config(name);
		configs.set(name, config);
		return config;
	}
}
