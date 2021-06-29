import { ValidConfigValue } from '../types';
import ConfigField from './ConfigField';

const MapField = new WeakMap<ConfigMap, ConfigField>();
const FieldMap = new WeakMap<ConfigField, ConfigMap>();

export function getMap(field: ConfigField): ConfigMap {
	return FieldMap.get(field) || new ConfigMap(field);
}

class ConfigMap implements Map<string, ValidConfigValue> {
	constructor(field: ConfigField) {
		MapField.set(this, field);
		FieldMap.set(field, this);
	}
	get field(): ConfigField {
		const field = MapField.get(this);
		if (field) return field;
		throw new Error('ConfigField is gone!');
	}
	get size(): number {
		return this.field.array.length;
	}
	*[Symbol.iterator]() {
		for (const val of Object.entries(this.field)) {
			yield val;
		}
	}
	clear() {
		const field = this.field;
		field.array.filter((a) => false);
		return field;
	}
	delete(prop: string | Symbol) {
		const field = this.field;
		field.__set(prop.toString(), null);
		return true;
	}
	entries() {
		const iterate = this[Symbol.iterator]();
		const iterator = {
			[Symbol.iterator]: () => this.entries(),
			next: () => iterate.next(),
		};
		return iterator;
	}
	forEach(
		cb: (item: ValidConfigValue, prop: string, map: ConfigMap) => any,
		thisArg: any
	) {
		const field = this.field;
		for (const prop of Object.keys(field)) {
			try {
				cb.call(thisArg || this, field.__get(prop), prop, this);
			} catch (error) {
				console.error(error);
			}
		}
		return field;
	}
	get(prop: string) {
		return this.field.__get(prop) ?? undefined;
	}
	has(prop: string) {
		return this.field.__has(prop);
	}
	set(prop: string, val: ValidConfigValue | object) {
		this.field.__set(prop, val);
		return this;
	}
	*keys_iter() {
		for (const val of Object.keys(this.field)) {
			if (this.field.__get(val)) {
				yield val;
			}
		}
	}
	keys() {
		const iterate = this.keys_iter();
		const iterator = {
			[Symbol.iterator]: () => this.keys(),
			next: () => iterate.next(),
		};
		return iterator;
	}
	*vals_iter() {
		for (const key of this.keys_iter()) {
			yield this.field.__get(key);
		}
	}
	values() {
		const iterate = this.vals_iter();
		const iterator = {
			[Symbol.iterator]: () => this.values(),
			next: () => iterate.next(),
		};
		return iterator;
	}
	[Symbol.toStringTag] = 'ConfigMap';
}

export default ConfigMap;
module.exports = MapField;

Object.assign(MapField, {
	default: MapField,
	MapField,
	getMap,
});
