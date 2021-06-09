import { read, write } from 'doge-json';
import { fs } from 'doge-json';
import path from 'path';
import ConfigArray from './ConfigArray';
import ConfigField from './ConfigField';
import normalizeConfigName from '../utils/normalizeConfigName';
import { UnknownObject, ValidConfigValue } from '../types';

class Config extends ConfigField {

	constructor (name: string, defaults?: object) {
		super(null, null);
		name = normalizeConfigName(name);
		this.#_file = path.resolve('.', 'config', name + '.json');
		const data = read(this.#_file);
		this.#_data = new ConfigField(this, null);
		this.#_data.__setDefault(data || {}, defaults || {});
		this.__update();
	}

	#_file: string;
	#_data: ConfigField;

	__update (): void {
		for (const [ prop, data ] of Object.entries(this.#_data)) {
			if (prop in this) {} else {
				Object.defineProperty(this, prop, {
					configurable: true,
					enumerable: true,
					get () {
						return this.__get(prop);
					},
					set (val: ValidConfigValue | UnknownObject | object) {
						this.__set(prop, val);
					}
				});
			}
		}
	}

	__save (): void {
		write(this.#_file, this.#_data);
		this.__update();
	}

	get array (): ConfigArray {
		return this.#_data.array;
	}

	__get (prop: string): ValidConfigValue {
		return this.#_data.__get(prop);
	}

	__set (prop: string, val: ValidConfigValue | UnknownObject | object, save = true): ValidConfigValue {
		return this.#_data.__set(prop, val, save);
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
		return this.#_data.__getField(prop);
	}

	__getString (prop: string): string {
		return this.#_data.__getString(prop);
	}

	__getNumber (prop: string): number {
		return this.#_data.__getNumber(prop);
	}

	__getBoolean (prop: string): boolean {
		return this.#_data.__getBoolean(prop);
	}

	__getArray (prop: string): ConfigArray {
		return this.__getField(prop).array;
	}

	__forceField (prop: string): ConfigField {
		return this.#_data.__forceField(prop);
	}

	__forceString (prop: string): string {
		return this.#_data.__forceString(prop);
	}

	__forceNumber (prop: string): number {
		return this.#_data.__forceNumber(prop);
	}

	__forceBoolean (prop: string): boolean {
		return this.#_data.__forceBoolean(prop);
	}

	__forceArray (prop: string): ConfigArray {
		return this.#_data.__forceArray(prop);
	}

	__has (prop: string): boolean {
		return (prop in this.#_data);
	}

	__setDefault (...initArray: Array<any>): void {
		this.#_data.__setDefault(...initArray);
	}

}

export default Config;
module.exports = Config;

Object.assign(Config, {
	default: Config,
	Config,
});
