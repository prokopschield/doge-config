"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = exports.normalizeConfigName = exports.getConfig = exports.ConfigField = exports.ConfigArray = exports.Config = void 0;
const Config_1 = __importDefault(require("./classes/Config"));
exports.Config = Config_1.default;
const ConfigArray_1 = __importDefault(require("./classes/ConfigArray"));
exports.ConfigArray = ConfigArray_1.default;
const ConfigField_1 = __importDefault(require("./classes/ConfigField"));
exports.ConfigField = ConfigField_1.default;
const getConfig_1 = __importDefault(require("./utils/getConfig"));
exports.getConfig = getConfig_1.default;
const normalizeConfigName_1 = __importDefault(require("./utils/normalizeConfigName"));
exports.normalizeConfigName = normalizeConfigName_1.default;
const types = __importStar(require("./types"));
exports.types = types;
exports.default = Config_1.default;
