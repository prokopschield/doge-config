import Config from './classes/Config';
import ConfigArray from './classes/ConfigArray';
import ConfigDir from './classes/ConfigDir';
import ConfigField from './classes/ConfigField';

import getConfig from './utils/getConfig';
import normalizeConfigName from './utils/normalizeConfigName';

import * as types from './types';

export default Config;

export {
	Config,
	ConfigArray,
	ConfigDir,
	ConfigField,
	getConfig,
	normalizeConfigName,
	types,
};
