import Config from './Config';
import ConfigArray from './ConfigArray';
import {
	UnknownObject,
	ValidConfigValue,
} from '../types';

class ConfigField {
	constructor (parent: Config | ConfigField | null, data: UnknownObject | null) {
		this.#_parent = parent;
		if (data) {
			for (const prop in data) {
				this.__set(prop, data[prop], false);
			}
		}
	}

	#_array?: ConfigArray;
	get array (): ConfigArray {
		if (this.#_array) {
			return this.#_array;
		} else {
			return this.#_array = new ConfigArray(this);
		}
	}

	#_parent: Config | ConfigField | null;
	#_data: {
		[prop: string]: ValidConfigValue;
	} = {};

	__save (): void {
		this.#_parent?.__save();
		if (this.#_array) {
			Object.assign(this.#_array, Object.values(this));
		}
	}

	__get (prop: string): ValidConfigValue {
		return this.#_data[prop] || this.__set(prop, null);
	}

	__set (prop: string, val: ValidConfigValue | UnknownObject | object, save = true): ValidConfigValue {
		this.#_data[prop] = (typeof val === 'object') ? (
			val && new ConfigField(this, { ...val })
		) : val;
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

	has (prop: string): boolean {
		return this.__has(prop);
	}

	__getField (prop: string): ConfigField {
		let val = this.__get(prop);
		if (val instanceof ConfigField) {
			return val;
		} else {
			this.__set(prop, val ? { data: val } : {});
			return this.__getField(prop);
		}
	}

	__getString (prop: string): string {
		let val = this.__get(prop);
		if (!val) {
			return '';
		} else if (typeof val === 'string') {
			return val;
		} else if (typeof val === 'object') {
			return Object.keys(val).length ? JSON.stringify(val, null, '\t') + '\n' : '';
		} else {
			return val.toString();
		}
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
			return !!(val && Object.keys(val).length);
		} else return !!val;
	}

	__getArray (prop: string): ConfigArray {
		return this.__getField(prop).array;
	}

	__has (prop: string): boolean {
		return (prop in this);
	}

	__setDefault (...initArray: Array<any>): void {
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

export default ConfigField;
module.exports = ConfigField;

Object.assign(ConfigField, {
	default: ConfigField,
	ConfigField,
});
