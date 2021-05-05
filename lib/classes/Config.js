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
var __file, __data;
Object.defineProperty(exports, "__esModule", { value: true });
const doge_json_1 = require("doge-json");
const doge_json_2 = require("doge-json");
const path_1 = __importDefault(require("path"));
const ConfigField_1 = __importDefault(require("./ConfigField"));
const normalizeConfigName_1 = __importDefault(require("../utils/normalizeConfigName"));
class Config extends ConfigField_1.default {
    constructor(name, defaults) {
        super(null, null);
        __file.set(this, void 0);
        __data.set(this, void 0);
        name = normalizeConfigName_1.default(name);
        __classPrivateFieldSet(this, __file, path_1.default.resolve('.', 'config', name + '.json'));
        if (!doge_json_2.fs.existsSync('./config')) {
            doge_json_2.fs.mkdirSync('./config');
        }
        const data = doge_json_1.read(__classPrivateFieldGet(this, __file));
        __classPrivateFieldSet(this, __data, new ConfigField_1.default(this, null));
        __classPrivateFieldGet(this, __data).__setDefault(data, defaults);
        this.__update();
    }
    __update() {
        for (const [prop, data] of Object.entries(__classPrivateFieldGet(this, __data))) {
            if (prop in this) { }
            else {
                Object.defineProperty(this, prop, {
                    configurable: true,
                    enumerable: true,
                    get() {
                        return this.__get(prop);
                    },
                    set(val) {
                        this.__set(prop, val);
                    }
                });
            }
        }
    }
    __save() {
        doge_json_1.write(__classPrivateFieldGet(this, __file), __classPrivateFieldGet(this, __data));
        this.__update();
    }
    get array() {
        return __classPrivateFieldGet(this, __data).array;
    }
    __get(prop) {
        return __classPrivateFieldGet(this, __data).__get(prop);
    }
    __set(prop, val, save = true) {
        return __classPrivateFieldGet(this, __data).__set(prop, val, save);
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
        return __classPrivateFieldGet(this, __data).__getField(prop);
    }
    __getString(prop) {
        return __classPrivateFieldGet(this, __data).__getString(prop);
    }
    __getNumber(prop) {
        return __classPrivateFieldGet(this, __data).__getNumber(prop);
    }
    __getBoolean(prop) {
        return __classPrivateFieldGet(this, __data).__getBoolean(prop);
    }
    __getArray(prop) {
        return this.__getField(prop).array;
    }
    __has(prop) {
        return (prop in __classPrivateFieldGet(this, __data));
    }
    __setDefault(...initArray) {
        __classPrivateFieldGet(this, __data).__setDefault(...initArray);
    }
}
__file = new WeakMap(), __data = new WeakMap();
exports.default = Config;
module.exports = Config;
Object.assign(Config, {
    default: Config,
    Config,
});
