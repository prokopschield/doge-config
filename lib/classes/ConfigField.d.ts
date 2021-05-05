import Config from './Config';
import ConfigArray from './ConfigArray';
import { UnknownObject, ValidConfigValue } from '../types';
declare class ConfigField {
    #private;
    constructor(parent: Config | ConfigField | null, data: UnknownObject | null);
    get array(): ConfigArray;
    __save(): void;
    __get(prop: string): ValidConfigValue;
    __set(prop: string, val: ValidConfigValue | UnknownObject | object, save?: boolean): ValidConfigValue;
    save(): void;
    get(prop: string): ValidConfigValue;
    set(prop: string, val: ValidConfigValue | UnknownObject | object): ValidConfigValue;
    has(prop: string): boolean;
    __getField(prop: string): ConfigField;
    __getString(prop: string): string;
    __getNumber(prop: string): number;
    __getBoolean(prop: string): boolean;
    __getArray(prop: string): ConfigArray;
    __has(prop: string): boolean;
    __setDefault(...initArray: Array<any>): void;
}
export default ConfigField;
