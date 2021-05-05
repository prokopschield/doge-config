"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __field;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigArray = void 0;
class ConfigArray extends Array {
    constructor(field) {
        super(...Object.values(field));
        __field.set(this, void 0);
        __classPrivateFieldSet(this, __field, field);
    }
    __save() {
        let index = -1;
        const keys = Object.keys(__classPrivateFieldGet(this, __field));
        for (const val of this) {
            __classPrivateFieldGet(this, __field).__set(keys[++index] || index.toString(), val, false);
        }
        for (; index < keys.length;) {
            const key = keys[++index];
            Object.defineProperty(__classPrivateFieldGet(this, __field), key, {
                configurable: true,
                enumerable: false,
                get() {
                    return undefined;
                },
                set(val) {
                    this.__set(key, val);
                }
            });
        }
        __classPrivateFieldGet(this, __field).save();
    }
}
exports.default = ConfigArray;
exports.ConfigArray = ConfigArray;
__field = new WeakMap();
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
        [method]: function (...args) {
            const result = ((Array.prototype[method]).call(this, ...args));
            if (result instanceof ConfigArray) {
                Object.assign(this, result);
                this.__save();
                return this;
            }
            this.__save();
            return result;
        }
    });
}
module.exports = ConfigArray;
Object.assign(ConfigArray, {
    default: ConfigArray,
    ConfigArray,
});
