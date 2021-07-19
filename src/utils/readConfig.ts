import ConfigField from '../classes/ConfigField';
import { ReadObject } from '../types';

export function readConfig(config: ConfigField): ReadObject {
	const ret_obj: ReadObject = {};
	for (const [key, value] of Object.entries(config)) {
		ret_obj[key] =
			value instanceof ConfigField
				? value.is_array
					? Object.values(readConfig(value))
					: readConfig(value)
				: value;
	}
	return ret_obj;
}

export default readConfig;
module.exports = readConfig;

Object.assign(readConfig, {
	default: readConfig,
	readConfig,
});
