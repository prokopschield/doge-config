export function normalizeConfigName(name: string) {
	return (
		name
			.toLowerCase()
			.replace(/\.json/gi, '')
			.replace(/[^a-z0-9]+/, '-') || 'invalid'
	);
}

export default normalizeConfigName;
module.exports = normalizeConfigName;

Object.defineProperties(normalizeConfigName, {
	default: { get: () => normalizeConfigName },
	normalizeConfigName: { get: () => normalizeConfigName },
});
