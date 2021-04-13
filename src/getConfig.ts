import { Config } from './Config';
import { normalizeConfigName } from './normalizeConfigName';

const configs = new Map<string, Config>();

export function getConfig (name: string): Config {
	name = normalizeConfigName(name)
	const config = configs.get(name);
	if (config) {
		return config;
	} else {
		const config = new Config(name);
		configs.set(name, config);
		return config;
	}
}
