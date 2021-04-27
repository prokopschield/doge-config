import { read, write } from 'doge-json';
import { fs } from 'doge-json';
import path from 'path';
import ConfigArray from './ConfigArray';
import { normalizeConfigName } from './normalizeConfigName';

export type ValidConfigValue = ConfigField | string | number;

export type UnknownObject = {
	[prop: string]: UnknownObject | ValidConfigValue;
};

export class ConfigField {
	constructor (parent: Config | ConfigField | null, data: UnknownObject | null) {
		this.#_parent = parent;
		if (data) {
			for (const prop in data) {
				this.__set(prop, data[prop], false)
			}
		}
	}

	#_array?: ConfigArray;
	get array () {
		if (this.#_array) {
			return this.#_array;
		} else {
			return this.#_array = new ConfigArray(this);
		}
	}

	#_parent: Config | ConfigField | null;
	#_data: {
		[prop: string]: ConfigField | string | number;
	} = {};

	__save (): void {
		this.#_parent?.save();
		if (this.#_array) {
			Object.assign(this.#_array, Object.values(this));
		}
	}

	__get (prop: string): ValidConfigValue {
		return this.#_data[prop] || this.__set(prop, {});
	}

	__set (prop: string, val: ValidConfigValue | UnknownObject | object, save = true): ValidConfigValue {
		this.#_data[prop] = (typeof val === 'object') ? new ConfigField(this, { ...val }) : val;
		Object.defineProperty(this, prop, {
			configurable: true,
			enumerable: true,
			get () {
				return this.#_data[prop];
			},
			set (val: ValidConfigValue | UnknownObject | object) {
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

	set (prop: string, val: ValidConfigValue | UnknownObject | object): ValidConfigValue {
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

	__has (prop: string): boolean {
		return (prop in this);
	}

	__setDefault (...initArray: Array<any>) {
		for (const init of initArray) {
			if (init && (typeof init === 'object')) {
				for (const prop in init) {
					const val: any = init[prop];
					if (typeof val === 'object') {
						const candidate = this.#_data[prop] || this.__set(prop, {}, false);
						const field: ConfigField = (
							(candidate instanceof ConfigField)
							? candidate
							: (
								this.__set(prop, { data: candidate }, false),
								this.__getField(prop)
							)
						);
						field.__setDefault(val);
					} else {
						if (!this.__has(prop)) {
							this.__set(prop, val, false);
						}
					}
				}
			} else if (init) {
				if (!this.__has('data')) {
					this.__set('data', init, false);
				}
			}
		}
	}
}

export class Config extends ConfigField {

	constructor (name: string, defaults?: object) {
		super(null, null);
		name = normalizeConfigName(name);
		this.#_file = path.resolve('.', 'config', name + '.json');
		if (!fs.existsSync('./config')) {
			fs.mkdirSync('./config');
		}
		const data = read(this.#_file);
		this.__setDefault(data, defaults);
	}

	#_file: string;

	__save () {
		write(this.#_file, this);
	}

}
