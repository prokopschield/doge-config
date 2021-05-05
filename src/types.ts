import ConfigField from './classes/ConfigField';

export type ValidConfigValue = ConfigField | string | number | boolean | null;

export type UnknownObject = {
	[prop: string]: UnknownObject | ValidConfigValue;
};
