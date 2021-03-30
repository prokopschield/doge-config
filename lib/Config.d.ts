declare type ValidConfigValue = ConfigField | string | number;
declare type UnknownObject = {
    [prop: string]: UnknownObject | ValidConfigValue;
};
declare class ConfigField {
    #private;
    constructor(parent: Config | ConfigField | null, data: UnknownObject | null);
    __save(): void;
    __get(prop: string): ValidConfigValue;
    __set(prop: string, val: ValidConfigValue | UnknownObject, save?: boolean): ValidConfigValue;
    save(): void;
    get(prop: string): ValidConfigValue;
    set(prop: string, val: ValidConfigValue | UnknownObject): ValidConfigValue;
}
export declare class Config extends ConfigField {
    #private;
    constructor(name: string);
    __save(): void;
}
export {};
