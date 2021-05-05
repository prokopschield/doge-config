import ConfigField from './classes/ConfigField';
export declare type ValidConfigValue = ConfigField | string | number | boolean | null;
export declare type UnknownObject = {
    [prop: string]: UnknownObject | ValidConfigValue;
};
