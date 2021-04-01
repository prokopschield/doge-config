"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const Config_1 = require("./Config");
const normalizeConfigName_1 = require("./normalizeConfigName");
const configs = new Map();
function getConfig(name) {
    name = normalizeConfigName_1.normalizeConfigName(name);
    if (configs.has(name)) {
        return configs.get(name);
    }
    else {
        const config = new Config_1.Config(name);
        configs.set(name, config);
        return config;
    }
}
exports.getConfig = getConfig;
