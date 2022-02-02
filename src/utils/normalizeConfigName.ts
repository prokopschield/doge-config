export function normalizeConfigName(name: string) {
    return (
        name
            .toLowerCase()
            .replace(/\.json/gi, '')
            .replace(/[^\da-z]+/, '-') || 'invalid'
    );
}

export default normalizeConfigName;
module.exports = normalizeConfigName;

Object.defineProperties(normalizeConfigName, {
    default: { get: () => normalizeConfigName },
    normalizeConfigName: { get: () => normalizeConfigName },
});
