import { Config } from './classes/Config';
export default Config;

export { Config };
export { ConfigArray } from './classes/ConfigArray';
export { ConfigDir } from './classes/ConfigDir';
export { ConfigField } from './classes/ConfigField';
export { ConfigMap } from './classes/ConfigMap';

export { getConfig } from './utils/getConfig';
export { getConfigDir } from './utils/getConfigDir';
export { normalizeConfigName } from './utils/normalizeConfigName';

export * as types from './types';
