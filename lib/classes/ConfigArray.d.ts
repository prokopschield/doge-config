import { ConfigField, types } from '..';
export default class ConfigArray extends Array<types.ValidConfigValue> {
    #private;
    constructor(field: ConfigField);
    __save(): void;
}
export { ConfigArray, };
