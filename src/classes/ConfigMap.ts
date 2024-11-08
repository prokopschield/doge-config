import { ValidConfigValue } from '../types';
import ConfigField from './ConfigField';

const MapField = new WeakMap<ConfigMap, ConfigField>();
const FieldMap = new WeakMap<ConfigField, ConfigMap>();

export function getMap(field: ConfigField): ConfigMap {
    return FieldMap.get(field) || new ConfigMap(field);
}

export class ConfigMap implements Map<string, ValidConfigValue> {
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
    *[Symbol.iterator](): Generator<[string, ValidConfigValue], undefined> {
        for (const value of Object.entries(this.field)) {
            yield value;
        }

        // typescript demands undefined, refuses void
        return undefined;
    }
    clear() {
        const { field } = this;

        field.array.filter((_a) => false);

        return field;
    }
    delete(property: string | Symbol) {
        const { field } = this;

        field.__set(property.toString(), null);

        return true;
    }
    entries() {
        const iterate = this[Symbol.iterator]();

        return {
            [Symbol.iterator]: () => this.entries(),
            next: () => iterate.next(),
        };
    }
    forEach(
        callback: (
            item: ValidConfigValue,
            property: string,
            map: ConfigMap
        ) => any,
        thisArgument: any
    ) {
        const { field } = this;

        for (const property of Object.keys(field)) {
            try {
                callback.call(
                    thisArgument || this,
                    field.__get(property),
                    property,
                    this
                );
            } catch (error) {
                console.error(error);
            }
        }

        return field;
    }
    get(property: string) {
        return this.field.__get(property) ?? undefined;
    }
    has(property: string) {
        return this.field.__has(property);
    }
    set(property: string, value: ValidConfigValue | object) {
        this.field.__set(property, value);

        return this;
    }
    *keys_iter(): Generator<string> {
        for (const value of Object.keys(this.field)) {
            if (this.field.__get(value)) {
                yield value;
            }
        }
    }
    keys() {
        const iterate = this.keys_iter();

        return {
            [Symbol.iterator]: () => this.keys(),
            next: () => iterate.next(),
        };
    }
    *vals_iter(): Generator<ValidConfigValue> {
        for (const key of this.keys_iter()) {
            yield this.field.__get(key);
        }
    }
    values() {
        const iterate = this.vals_iter();

        return {
            [Symbol.iterator]: () => this.values(),
            next: () => iterate.next(),
        };
    }
    [Symbol.toStringTag] = 'ConfigMap';
}

export default ConfigMap;
module.exports = ConfigMap;

Object.defineProperties(ConfigMap, {
    default: { get: () => ConfigMap },
    MapField: { get: () => ConfigMap },
    getMap: { get: () => getMap },
});
