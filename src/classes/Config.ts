import { read } from 'doge-json';
import path from 'path';

import { UnknownObject, ValidConfigValue } from '../types';
import normalizeConfigName from '../utils/normalizeConfigName';
import writeConfig from '../utils/writeConfig';
import ConfigArray from './ConfigArray';
import ConfigField from './ConfigField';

export class Config extends ConfigField {
    constructor(name: string, defaults?: object, confdir = 'config') {
        super(null, null);
        name = normalizeConfigName(name);
        this.#_file = path.resolve('.', confdir, name + '.json');
        const data = read(this.#_file);

        this.#_data = new ConfigField(this, null);
        this.#_data.__setDefault(data || {}, defaults || {});
        this.__update();
    }

    #_file: string;
    #_data: ConfigField;

    __update(): void {
        for (const property of Object.keys(this.#_data)) {
            if (property in this) {} else {
                Object.defineProperty(this, property, {
                    configurable: true,
                    enumerable: true,
                    get() {
                        return this.__get(property);
                    },
                    set(value: ValidConfigValue | UnknownObject | object) {
                        this.__set(property, value);
                    },
                });
            }
        }
    }

    __save(): void {
        writeConfig(this.#_file, this.#_data);
        this.__update();
    }

    get array(): ConfigArray {
        return this.#_data.array;
    }

    __get(property: string): ValidConfigValue {
        return this.#_data.__get(property);
    }

    __set(
        property: string,
        value: ValidConfigValue | UnknownObject | object,
        save = true
    ): ValidConfigValue {
        return this.#_data.__set(property, value, save);
    }

    save(): void {
        return this.__save();
    }

    get(property: string): ValidConfigValue {
        return this.__get(property);
    }

    set(
        property: string,
        value: ValidConfigValue | UnknownObject | object
    ): ValidConfigValue {
        return this.__set(property, value);
    }

    has(property: string): boolean {
        return this.__has(property);
    }

    __getField(property: string): ConfigField {
        return this.#_data.__getField(property);
    }

    __getString(property: string): string {
        return this.#_data.__getString(property);
    }

    __getNumber(property: string): number {
        return this.#_data.__getNumber(property);
    }

    __getBoolean(property: string): boolean {
        return this.#_data.__getBoolean(property);
    }

    __getArray(property: string): ConfigArray {
        return this.__getField(property).array;
    }

    __forceField(property: string): ConfigField {
        return this.#_data.__forceField(property);
    }

    __forceString(property: string): string {
        return this.#_data.__forceString(property);
    }

    __forceNumber(property: string): number {
        return this.#_data.__forceNumber(property);
    }

    __forceBoolean(property: string): boolean {
        return this.#_data.__forceBoolean(property);
    }

    __forceArray(property: string): ConfigArray {
        return this.#_data.__forceArray(property);
    }

    __has(property: string): boolean {
        return property in this.#_data;
    }

    __setDefault(...initArray: Array<any>): void {
        this.#_data.__setDefault(...initArray);
    }

    toJSON() {
        return this.#_data.toJSON();
    }
}

export default Config;
module.exports = Config;

Object.defineProperties(Config, {
    default: { get: () => Config },
    Config: { get: () => Config },
});
