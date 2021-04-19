import { ConfigField, ValidConfigValue } from '.';
export default class ConfigArray extends Array<ValidConfigValue> {
    #private;
    constructor(field: ConfigField);
    __save(): void;
}
export { ConfigArray, };
