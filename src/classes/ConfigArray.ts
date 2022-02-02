import { ConfigField } from '../classes/ConfigField';
import * as types from '../types';

export class ConfigArray extends Array<types.ValidConfigValue> {
    constructor(field: ConfigField) {
        super(...Object.values(field));
        this.#_field = field;
    }
    #_field: ConfigField;
    __save() {
        let index = -1;
        const keys = Object.keys(this.#_field);
        for (const val of this) {
            this.#_field.__set(keys[++index] || index.toString(), val, false);
        }
        for (; index < keys.length; ) {
            const key = keys[++index];
            Object.defineProperty(this.#_field, key, {
                configurable: true,
                enumerable: false,
                get() {
                    return undefined;
                },
                set(
                    val: types.ValidConfigValue | types.UnknownObject | object
                ) {
                    this.__set(key, val);
                },
            });
        }
        this.#_field.save();
    }
}

const methods = [
    'concat',
    'copyWithin',
    'entries',
    'every',
    'fill',
    'filter',
    'find',
    'findIndex',
    'forEach',
    'includes',
    'indexOf',
    'join',
    'keys',
    'lastIndexOf',
    'length',
    'map',
    'pop',
    'push',
    'reduce',
    'reduceRight',
    'reverse',
    'shift',
    'slice',
    'some',
    'sort',
    'splice',
    'toLocaleString',
    'toString',
    'unshift',
    'values',
];

for (const method of methods) {
    Object.assign(ConfigArray.prototype, {
        [method]: function (...args: any[]) {
            const result = (Array as any).prototype[method].call(this, ...args);
            if (result instanceof ConfigArray) {
                Object.assign(this, result);
                this.__save();
                return this;
            }
            this.__save();
            return result;
        },
    });
}

export default ConfigArray;
module.exports = ConfigArray;

Object.defineProperties(ConfigArray, {
    default: { get: () => ConfigArray },
    ConfigArray: { get: () => ConfigArray },
});
