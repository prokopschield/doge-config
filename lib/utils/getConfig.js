"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("../classes/Config"));
const normalizeConfigName_1 = __importDefault(require("./normalizeConfigName"));
const configs = new Map();
function getConfig(name, defaults) {
    name = normalizeConfigName_1.default(name);
    const config = configs.get(name);
    if (config) {
        return config;
    }
    else {
        const config = new Config_1.default(name, defaults);
        configs.set(name, config);
        return config;
    }
}
exports.default = getConfig;
module.exports = getConfig;
Object.assign(getConfig, {
    default: getConfig,
    getConfig,
});
