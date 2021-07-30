import ConfigField from './classes/ConfigField';

export type Primitive = string | number | boolean | null;

export type ValidConfigValue = ConfigField | Primitive;

export type UnknownObject = {
	[prop: string]: UnknownObject | ValidConfigValue;
};

export type ReadValue =
	| string
	| number
	| boolean
	| null
	| undefined
	| Array<ReadValue>
	| ReadObject;

export type ReadObject = {
	[key: string]: ReadValue;
};

export type Flattened =
	| {
			[key: string]: Flattened;
	  }
	| Array<Flattened>
	| Primitive;
