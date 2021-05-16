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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __array, __parent, __data;
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigArray_1 = __importDefault(require("./ConfigArray"));
class ConfigField {
    constructor(parent, data) {
        __array.set(this, void 0);
        __parent.set(this, void 0);
        __data.set(this, {});
        __classPrivateFieldSet(this, __parent, parent);
        if (data) {
            for (const prop in data) {
                this.__set(prop, data[prop], false);
            }
        }
    }
    get array() {
        if (__classPrivateFieldGet(this, __array)) {
            return __classPrivateFieldGet(this, __array);
        }
        else {
            return __classPrivateFieldSet(this, __array, new ConfigArray_1.default(this));
        }
    }
    __save() {
        var _a;
        (_a = __classPrivateFieldGet(this, __parent)) === null || _a === void 0 ? void 0 : _a.__save();
        if (__classPrivateFieldGet(this, __array)) {
            Object.assign(__classPrivateFieldGet(this, __array), Object.values(this));
        }
    }
    __get(prop) {
        return __classPrivateFieldGet(this, __data)[prop] || this.__set(prop, null);
    }
    __set(prop, val, save = true) {
        __classPrivateFieldGet(this, __data)[prop] = (typeof val === 'object') ? (val && new ConfigField(this, { ...val })) : val;
        Object.defineProperty(this, prop, {
            configurable: true,
            enumerable: true,
            get() {
                return __classPrivateFieldGet(this, __data)[prop];
            },
            set(val) {
                this.__set(prop, val);
            }
        });
        if (save) {
            this.__save();
        }
        return __classPrivateFieldGet(this, __data)[prop];
    }
    save() {
        return this.__save();
    }
    get(prop) {
        return this.__get(prop);
    }
    set(prop, val) {
        return this.__set(prop, val);
    }
    has(prop) {
        return this.__has(prop);
    }
    __getField(prop) {
        let val = this.__get(prop);
        if (val instanceof ConfigField) {
            return val;
        }
        else {
            return this.__forceField(prop);
        }
    }
    __getString(prop) {
        let val = this.__get(prop);
        if (!val) {
            return '';
        }
        else if (typeof val === 'string') {
            return val;
        }
        else if (typeof val === 'object') {
            return Object.keys(val).length ? JSON.stringify(val, null, '\t') + '\n' : '';
        }
        else {
            return val.toString();
        }
    }
    __getNumber(prop) {
        let val = this.__get(prop);
        if (typeof val === 'number') {
            return val;
        }
        else
            return parseFloat(this.__getString(prop)) || 0;
    }
    __getBoolean(prop) {
        let val = this.__get(prop);
        if (typeof val === 'object') {
            return !!(val && Object.keys(val).length);
        }
        else
            return !!val;
    }
    __getArray(prop) {
        return this.__getField(prop).array;
    }
    __forceField(prop) {
        const field = this.__get(prop);
        if (field instanceof ConfigField) {
            return field;
        }
        else {
            this.__set(prop, field ? { data: field } : {});
            return this.__getField(prop);
        }
    }
    __forceString(prop) {
        const val = this.__get(prop);
        if (typeof val !== 'string') {
            if (typeof val === 'object') {
                this.__set(prop, JSON.stringify(val));
            }
            else if (val) {
                this.__set(prop, '' + val);
            }
            else {
                this.__set(prop, '');
            }
            return this.__forceString(prop);
        }
        else
            return val;
    }
    __forceNumber(prop) {
        const val = this.__get(prop);
        if ((typeof val !== 'number') || !(val > -Infinity)) {
            this.__set(prop, (val && +val) || 0);
            return this.__forceNumber(prop);
        }
        else
            return val;
    }
    __forceBoolean(prop) {
        const val = this.__get(prop);
        if (typeof val !== 'boolean') {
            this.__set(prop, !!val);
            return this.__forceBoolean(prop);
        }
        else
            return val;
    }
    __forceArray(prop) {
        return this.__forceField(prop).array;
    }
    __has(prop) {
        return (prop in this);
    }
    __setDefault(...initArray) {
        for (const init of initArray) {
            if (init && (typeof init === 'object')) {
                for (const prop in init) {
                    const val = init[prop];
                    if (typeof val === 'object') {
                        const candidate = __classPrivateFieldGet(this, __data)[prop] || this.__set(prop, {}, false);
                        const field = ((candidate instanceof ConfigField)
                            ? candidate
                            : (this.__set(prop, { data: candidate }, false),
                                this.__getField(prop)));
                        field.__setDefault(val);
                    }
                    else {
                        if (!this.__has(prop)) {
                            this.__set(prop, val, false);
                        }
                    }
                }
            }
            else if (init) {
                if (!this.__has('data')) {
                    this.__set('data', init, false);
                }
            }
        }
    }
}
__array = new WeakMap(), __parent = new WeakMap(), __data = new WeakMap();
exports.default = ConfigField;
module.exports = ConfigField;
Object.assign(ConfigField, {
    default: ConfigField,
    ConfigField,
});
