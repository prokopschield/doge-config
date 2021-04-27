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
var __array, __parent, __data, __file;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = exports.ConfigField = void 0;
const doge_json_1 = require("doge-json");
const doge_json_2 = require("doge-json");
const path_1 = __importDefault(require("path"));
const ConfigArray_1 = __importDefault(require("./ConfigArray"));
const normalizeConfigName_1 = require("./normalizeConfigName");
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
        __classPrivateFieldGet(this, __parent)?.save();
        if (__classPrivateFieldGet(this, __array)) {
            Object.assign(__classPrivateFieldGet(this, __array), Object.values(this));
        }
    }
    __get(prop) {
        return __classPrivateFieldGet(this, __data)[prop] || this.__set(prop, {});
    }
    __set(prop, val, save = true) {
        __classPrivateFieldGet(this, __data)[prop] = (typeof val === 'object') ? new ConfigField(this, { ...val }) : val;
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
    __getField(prop) {
        let val = this.__get(prop);
        if (val instanceof ConfigField) {
            return val;
        }
        else {
            this.__set(prop, { data: val });
            return this.__getField(prop);
        }
    }
    __getString(prop) {
        let val = this.__get(prop);
        if (typeof val === 'string') {
            return val;
        }
        else if (typeof val === 'object') {
            return Object.keys(val).length ? JSON.stringify(val, null, '\t') + '\n' : '';
        }
        else if (val) {
            return val.toString();
        }
        else
            return '';
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
            return !!Object.keys(val).length;
        }
        else
            return !!val;
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
exports.ConfigField = ConfigField;
__array = new WeakMap(), __parent = new WeakMap(), __data = new WeakMap();
class Config extends ConfigField {
    constructor(name, defaults) {
        super(null, null);
        __file.set(this, void 0);
        name = normalizeConfigName_1.normalizeConfigName(name);
        __classPrivateFieldSet(this, __file, path_1.default.resolve('.', 'config', name + '.json'));
        if (!doge_json_2.fs.existsSync('./config')) {
            doge_json_2.fs.mkdirSync('./config');
        }
        const data = doge_json_1.read(__classPrivateFieldGet(this, __file));
        this.__setDefault(data, defaults);
    }
    __save() {
        doge_json_1.write(__classPrivateFieldGet(this, __file), this);
    }
}
exports.Config = Config;
__file = new WeakMap();
