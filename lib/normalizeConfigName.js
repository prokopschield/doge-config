"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeConfigName = void 0;
function normalizeConfigName(name) {
    return name
        .toLowerCase()
        .replace(/\.json/gi, '')
        .replace(/[^a-z0-9]+/, '-')
        || 'invalid';
}
exports.normalizeConfigName = normalizeConfigName;
