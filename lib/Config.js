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
var __parent, __data, __file;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const doge_json_1 = require("doge-json");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class ConfigField {
    constructor(parent, data) {
        __parent.set(this, void 0);
        __data.set(this, {});
        __classPrivateFieldSet(this, __parent, parent);
        if (data) {
            for (const prop in data) {
                this.__set(prop, data[prop], false);
            }
        }
    }
    __save() {
        __classPrivateFieldGet(this, __parent)?.save();
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
}
__parent = new WeakMap(), __data = new WeakMap();
class Config extends ConfigField {
    constructor(name) {
        super(null, null);
        __file.set(this, void 0);
        name = name
            .toLowerCase()
            .replace(/\.json/gi, '')
            .replace(/[^a-z0-9]+/, '-');
        __classPrivateFieldSet(this, __file, path_1.default.resolve('.', 'config', name + '.json'));
        if (!fs_1.default.existsSync('./config')) {
            fs_1.default.mkdirSync('./config');
        }
        const data = doge_json_1.read(__classPrivateFieldGet(this, __file));
        for (const key in data) {
            this.__set(key, data[key], false);
        }
    }
    __save() {
        doge_json_1.write(__classPrivateFieldGet(this, __file), this);
    }
}
exports.Config = Config;
__file = new WeakMap();
