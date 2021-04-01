export function normalizeConfigName (name: string) {
	return name
		.toLowerCase()
		.replace(/\.json/gi, '')
		.replace(/[^a-z0-9]+/, '-')
		|| 'invalid'
}
