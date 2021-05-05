import ConfigArray from './ConfigArray';
import ConfigField from './ConfigField';
import { UnknownObject, ValidConfigValue } from '../types';
declare class Config extends ConfigField {
    #private;
    constructor(name: string, defaults?: object);
    __update(): void;
    __save(): void;
    get array(): ConfigArray;
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
export default Config;
