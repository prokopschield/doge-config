import { read, write } from 'doge-json';
import fs from 'fs';
import path from 'path';
import { normalizeConfigName } from './normalizeConfigName';

type ValidConfigValue = ConfigField | string | number;

type UnknownObject = {
	[prop: string]: UnknownObject | ValidConfigValue;
};

class ConfigField {
	constructor (parent: Config | ConfigField | null, data: UnknownObject | null) {
		this.#_parent = parent;
		if (data) {
			for (const prop in data) {
				this.__set(prop, data[prop], false)
			}
		}
	}

	#_parent: Config | ConfigField | null;
	#_data: {
		[prop: string]: ConfigField | string | number;
	} = {};

	__save (): void {
		this.#_parent?.save();
	}

	__get (prop: string): ValidConfigValue {
		return this.#_data[prop] || this.__set(prop, {});
	}

	__set (prop: string, val: ValidConfigValue | UnknownObject, save = true): ValidConfigValue {
		this.#_data[prop] = (typeof val === 'object') ? new ConfigField(this, { ...val }) : val;
		Object.defineProperty(this, prop, {
			configurable: true,
			enumerable: true,
			get () {
				return this.#_data[prop];
			},
			set (val: ValidConfigValue | UnknownObject) {
				this.__set(prop, val);
			}
		});
		if (save) {
			this.__save();
		}
		return this.#_data[prop];
	}

	save (): void {
		return this.__save();
	}

	get (prop: string): ValidConfigValue {
		return this.__get(prop);
	}

	set (prop: string, val: ValidConfigValue | UnknownObject): ValidConfigValue {
		return this.__set(prop, val);
	}

	__getField (prop: string): ConfigField {
		let val = this.__get(prop);
		if (val instanceof ConfigField) {
			return val;
		} else {
			this.__set(prop, { data: val });
			return this.__getField(prop);
		}
	}

	__getString (prop: string): string {
		let val = this.__get(prop);
		if (typeof val === 'string') {
			return val;
		} else if (typeof val === 'object') {
			return Object.keys(val).length ? JSON.stringify(val, null, '\t') + '\n' : '';
		} else if (val) {
			return val.toString();
		} else return '';
	}

	__getNumber (prop: string): number {
		let val = this.__get(prop);
		if (typeof val === 'number') {
			return val;
		} else return parseFloat(this.__getString(prop)) || 0;
	}

	__getBoolean (prop: string): boolean {
		let val = this.__get(prop);
		if (typeof val === 'object') {
			return !!Object.keys(val).length;
		} else return !!val;
	}
}

export class Config extends ConfigField {

	constructor (name: string) {
		super(null, null);
		name = normalizeConfigName(name);
		this.#_file = path.resolve('.', 'config', name + '.json');
		if (!fs.existsSync('./config')) {
			fs.mkdirSync('./config');
		}
		const data = read(this.#_file);
		for (const key in data) {
			this.__set(key, data[key], false);
		}
	}

	#_file: string;

	__save () {
		write(this.#_file, this);
	}

}
