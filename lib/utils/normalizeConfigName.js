"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function normalizeConfigName(name) {
    return name
        .toLowerCase()
        .replace(/\.json/gi, '')
        .replace(/[^a-z0-9]+/, '-')
        || 'invalid';
}
exports.default = normalizeConfigName;
module.exports = normalizeConfigName;
Object.assign(normalizeConfigName, {
    default: normalizeConfigName,
    normalizeConfigName,
});
