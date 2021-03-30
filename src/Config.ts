import { read, write } from 'doge-json';
import fs from 'fs';
import path from 'path';

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
}

export class Config extends ConfigField {

	constructor (name: string) {
		super(null, null);
		name = name
			.toLowerCase()
			.replace(/\.json/gi, '')
			.replace(/[^a-z0-9]+/, '-')
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
