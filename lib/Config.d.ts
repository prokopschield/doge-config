import ConfigArray from './ConfigArray';
export declare type ValidConfigValue = ConfigField | string | number;
export declare type UnknownObject = {
    [prop: string]: UnknownObject | ValidConfigValue;
};
export declare class ConfigField {
    #private;
    constructor(parent: Config | ConfigField | null, data: UnknownObject | null);
    get array(): ConfigArray;
    __save(): void;
    __get(prop: string): ValidConfigValue;
    __set(prop: string, val: ValidConfigValue | UnknownObject | object, save?: boolean): ValidConfigValue;
    save(): void;
    get(prop: string): ValidConfigValue;
    set(prop: string, val: ValidConfigValue | UnknownObject | object): ValidConfigValue;
    __getField(prop: string): ConfigField;
    __getString(prop: string): string;
    __getNumber(prop: string): number;
    __getBoolean(prop: string): boolean;
    __has(prop: string): boolean;
    __setDefault(...initArray: Array<any>): void;
}
export declare class Config extends ConfigField {
    #private;
    constructor(name: string, defaults?: object);
    __save(): void;
}
