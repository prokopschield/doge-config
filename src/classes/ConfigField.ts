import Config from './Config';
import ConfigArray from './ConfigArray';
import { UnknownObject, ValidConfigValue } from '../types';
import ConfigMap from './ConfigMap';
import { getMap } from './ConfigMap';

const proxies = {
	data: new WeakMap<ConfigField, ConfigField>(),
	num: new WeakMap<ConfigField, ConfigField>(),
	str: new WeakMap<ConfigField, ConfigField>(),
	bool: new WeakMap<ConfigField, ConfigField>(),
	obj: new WeakMap<ConfigField, ConfigField>(),
};

declare interface ConfigField {
	data: {
		[index: string]: ValidConfigValue;
	};
	bool: {
		[index: string]: boolean;
	};
	str: {
		[index: string]: string;
	};
	num: {
		[index: string]: number;
	};
	obj: {
		[index: string]: ConfigField;
	};
}

class ConfigField {
	constructor(parent: Config | ConfigField | null, data: UnknownObject | null) {
		this.#_parent = parent;
		if (data) {
			for (const prop in data) {
				this.__set(prop, data[prop], false);
			}
		}
		Object.defineProperties(this, {
			data: {
				get() {
					return (
						proxies.data.get(this) ||
						proxies.data
							.set(
								this,
								new Proxy(this, {
									get(field, prop, proxy) {
										return field.__get(prop.toString());
									},
									set(field, prop, val, proxy) {
										field.__set(prop.toString(), val);
										return true;
									},
								})
							)
							.get(this)
					);
				},
			},
			bool: {
				get() {
					return (
						proxies.bool.get(this) ||
						proxies.bool
							.set(
								this,
								new Proxy(this, {
									get(field, prop, proxy) {
										return field.__getBoolean(prop.toString());
									},
									set(field, prop, val, proxy) {
										field.__set(prop.toString(), !!val);
										return true;
									},
								})
							)
							.get(this)
					);
				},
			},
			str: {
				get() {
					return (
						proxies.str.get(this) ||
						proxies.str
							.set(
								this,
								new Proxy(this, {
									get(field, prop, proxy) {
										return field.__getString(prop.toString());
									},
									set(field, prop, val, proxy) {
										field.__set(prop.toString(), val.toString());
										return true;
									},
								})
							)
							.get(this)
					);
				},
			},
			num: {
				get() {
					return (
						proxies.num.get(this) ||
						proxies.num
							.set(
								this,
								new Proxy(this, {
									get(field, prop, proxy) {
										return field.__getNumber(prop.toString());
									},
									set(field, prop, val, proxy) {
										field.__set(prop.toString(), +val);
										return true;
									},
								})
							)
							.get(this)
					);
				},
			},
			obj: {
				get() {
					return (
						proxies.obj.get(this) ||
						proxies.obj
							.set(
								this,
								new Proxy(this, {
									get(field, prop, proxy) {
										return field.__getField(prop.toString());
									},
									set(field, prop, val, proxy) {
										field.__set(prop.toString(), val);
										return true;
									},
								})
							)
							.get(this)
					);
				},
			},
		});
	}

	#_array?: ConfigArray;
	get array(): ConfigArray {
		if (this.#_array) {
			return this.#_array;
		} else {
			return (this.#_array = new ConfigArray(this));
		}
	}

	get map(): ConfigMap {
		return getMap(this);
	}

	#_parent: Config | ConfigField | null;
	#_data: {
		[prop: string]: ValidConfigValue;
	} = {};

	__save(): void {
		if (this.#_array) {
			Object.assign(this.#_array, Object.values(this));
		}
		this.#_parent?.__save();
	}

	__get(prop: string): ValidConfigValue {
		if (prop in this.#_data) return this.#_data[prop];
		if (prop in this)
			return this.__set(
				prop,
				Object.values(this)[Object.keys(this).indexOf(prop)],
				false
			);
		return null;
	}

	__set(
		prop: string,
		val: ValidConfigValue | UnknownObject | object,
		save = true
	): ValidConfigValue {
		this.#_data[prop] =
			typeof val === 'object' ? val && new ConfigField(this, { ...val }) : val;
		Object.defineProperty(this, prop, {
			configurable: true,
			enumerable: true,
			get() {
				return this.#_data[prop];
			},
			set(val: ValidConfigValue | UnknownObject | object) {
				this.__set(prop, val, true);
			},
		});
		if (save) {
			this.__save();
		}
		return this.#_data[prop];
	}

	save(): void {
		return this.__save();
	}

	get(prop: string): ValidConfigValue {
		return this.__get(prop);
	}

	set(
		prop: string,
		val: ValidConfigValue | UnknownObject | object,
		save?: boolean
	): ValidConfigValue {
		return this.__set(prop, val, save);
	}

	has(prop: string): boolean {
		return this.__has(prop);
	}

	__getField(prop: string): ConfigField {
		let val = this.__get(prop);
		if (val instanceof ConfigField) {
			return val;
		} else {
			return this.__forceField(prop);
		}
	}

	__getString(prop: string): string {
		let val = this.__get(prop);
		if (!val) {
			return '';
		} else if (typeof val === 'string') {
			return val;
		} else if (typeof val === 'object') {
			return Object.keys(val).length
				? JSON.stringify(val, null, '\t') + '\n'
				: '';
		} else {
			return val.toString();
		}
	}

	__getNumber(prop: string): number {
		let val = this.__get(prop);
		if (typeof val === 'number') {
			return val;
		} else return parseFloat(this.__getString(prop)) || 0;
	}

	__getBoolean(prop: string): boolean {
		let val = this.__get(prop);
		if (typeof val === 'object') {
			return !!(val && Object.keys(val).length);
		} else return !!val;
	}

	__getArray(prop: string): ConfigArray {
		return this.__getField(prop).array;
	}

	__forceField(prop: string): ConfigField {
		const field = this.__get(prop);
		if (field instanceof ConfigField) {
			return field;
		} else {
			this.__set(prop, field ? { data: field } : {}, false);
			return this.__getField(prop);
		}
	}

	__forceString(prop: string): string {
		const val = this.__get(prop);
		if (typeof val !== 'string') {
			let ret: string;
			if (typeof val === 'object') {
				this.__set(prop, (ret = JSON.stringify(val)), false);
			} else if (val) {
				this.__set(prop, (ret = '' + val), false);
			} else {
				this.__set(prop, (ret = ''), false);
			}
			return ret;
		} else return val;
	}

	__forceNumber(prop: string): number {
		const val = this.__get(prop);
		if (typeof val !== 'number' || !(val > -Infinity)) {
			let ret: number;
			this.__set(prop, (ret = (val && +val) || 0), false);
			return ret;
		} else return val;
	}

	__forceBoolean(prop: string): boolean {
		const val = this.__get(prop);
		if (typeof val !== 'boolean') {
			let ret: boolean;
			this.__set(prop, (ret = !!val), false);
			return ret;
		} else return val;
	}

	__forceArray(prop: string): ConfigArray {
		return this.__forceField(prop).array;
	}

	__has(prop: string): boolean {
		return prop in this;
	}

	__setDefault(...initArray: Array<any>): void {
		for (const init of initArray) {
			if (init && typeof init === 'object') {
				for (const prop in init) {
					const val: any = init[prop];
					if (typeof val === 'object') {
						const candidate = this.#_data[prop] || this.__set(prop, {}, false);
						const field: ConfigField =
							candidate instanceof ConfigField
								? candidate
								: (this.__set(prop, { data: candidate }, false),
								  this.__getField(prop));
						field.__setDefault(val);
						if (val instanceof Array) {
							field.array;
						}
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

	toJSON() {
		if (this.#_array) {
			return [...this.#_array];
		} else {
			return { ...this.#_data };
		}
	}
}

export default ConfigField;
module.exports = ConfigField;

Object.assign(ConfigField, {
	default: ConfigField,
	ConfigField,
});
