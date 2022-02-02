import { Flattened, UnknownObject, ValidConfigValue } from '../types';
import Config from './Config';
import ConfigArray from './ConfigArray';
import ConfigMap from './ConfigMap';
import { getMap } from './ConfigMap';

const proxies = {
    data: new WeakMap<ConfigField, ConfigField>(),
    num: new WeakMap<ConfigField, ConfigField>(),
    str: new WeakMap<ConfigField, ConfigField>(),
    bool: new WeakMap<ConfigField, ConfigField>(),
    obj: new WeakMap<ConfigField, ConfigField>(),
};

export declare interface ConfigField {
    data: {
        [index: string]: ValidConfigValue;
    };
    bool: {
        [index: string]: boolean;
    };
    str: {
        [index: string]: string;
    };
    num: {
        [index: string]: number;
    };
    obj: {
        [index: string]: ConfigField;
    };
}

export class ConfigField {
    constructor(
        parent: Config | ConfigField | null,
        data: UnknownObject | null
    ) {
        this.#_parent = parent;

        if (data) {
            for (const property in data) {
                this.__set(property, data[property], false);
            }
        }

        Object.defineProperties(this, {
            data: {
                get() {
                    return (
                        proxies.data.get(this) ||
                        proxies.data
                            .set(
                                this,
                                new Proxy(this, {
                                    get(field, property, _proxy) {
                                        return field.__get(property.toString());
                                    },
                                    set(field, property, value, _proxy) {
                                        field.__set(property.toString(), value);

                                        return true;
                                    },
                                })
                            )
                            .get(this)
                    );
                },
            },
            bool: {
                get() {
                    return (
                        proxies.bool.get(this) ||
                        proxies.bool
                            .set(
                                this,
                                new Proxy(this, {
                                    get(field, property, _proxy) {
                                        return field.__getBoolean(
                                            property.toString()
                                        );
                                    },
                                    set(field, property, value, _proxy) {
                                        field.__set(
                                            property.toString(),
                                            !!value
                                        );

                                        return true;
                                    },
                                })
                            )
                            .get(this)
                    );
                },
            },
            str: {
                get() {
                    return (
                        proxies.str.get(this) ||
                        proxies.str
                            .set(
                                this,
                                new Proxy(this, {
                                    get(field, property, _proxy) {
                                        return field.__getString(
                                            property.toString()
                                        );
                                    },
                                    set(field, property, value, _proxy) {
                                        field.__set(
                                            property.toString(),
                                            value.toString()
                                        );

                                        return true;
                                    },
                                })
                            )
                            .get(this)
                    );
                },
            },
            num: {
                get() {
                    return (
                        proxies.num.get(this) ||
                        proxies.num
                            .set(
                                this,
                                new Proxy(this, {
                                    get(field, property, _proxy) {
                                        return field.__getNumber(
                                            property.toString()
                                        );
                                    },
                                    set(field, property, value, _proxy) {
                                        field.__set(
                                            property.toString(),
                                            +value
                                        );

                                        return true;
                                    },
                                })
                            )
                            .get(this)
                    );
                },
            },
            obj: {
                get() {
                    return (
                        proxies.obj.get(this) ||
                        proxies.obj
                            .set(
                                this,
                                new Proxy(this, {
                                    get(field, property, _proxy) {
                                        return field.__getField(
                                            property.toString()
                                        );
                                    },
                                    set(field, property, value, _proxy) {
                                        field.__set(property.toString(), value);

                                        return true;
                                    },
                                })
                            )
                            .get(this)
                    );
                },
            },
        });
    }

    #_array?: ConfigArray;
    get array(): ConfigArray {
        return this.#_array || (this.#_array = new ConfigArray(this));
    }

    get is_array(): ConfigArray | undefined {
        return this.#_array;
    }

    get map(): ConfigMap {
        return getMap(this);
    }

    #_parent: Config | ConfigField | null;
    #_data: {
        [prop: string]: ValidConfigValue;
    } = {};

    __save(): void {
        if (this.#_array) {
            Object.assign(this.#_array, Object.values(this));
        }

        this.#_parent?.__save();
    }

    __get(property: string): ValidConfigValue {
        if (property in this.#_data) return this.#_data[property];

        if (property in this)
            return this.__set(
                property,
                Object.values(this)[Object.keys(this).indexOf(property)],
                false
            );

        return null;
    }

    __set(
        property: string,
        value: ValidConfigValue | UnknownObject | object,
        save = true
    ): ValidConfigValue {
        this.#_data[property] =
            typeof value === 'object'
                ? value && new ConfigField(this, { ...value })
                : value;
        Object.defineProperty(this, property, {
            configurable: true,
            enumerable: true,
            get() {
                return this.#_data[property];
            },
            set(value: ValidConfigValue | UnknownObject | object) {
                this.__set(property, value, true);
            },
        });

        if (save) {
            this.__save();
        }

        return this.#_data[property];
    }

    save(): void {
        return this.__save();
    }

    get(property: string): ValidConfigValue {
        return this.__get(property);
    }

    set(
        property: string,
        value: ValidConfigValue | UnknownObject | object,
        save?: boolean
    ): ValidConfigValue {
        return this.__set(property, value, save);
    }

    has(property: string): boolean {
        return this.__has(property);
    }

    __getField(property: string): ConfigField {
        const value = this.__get(property);

        return value instanceof ConfigField
            ? value
            : this.__forceField(property);
    }

    __getString(property: string): string {
        const value = this.__get(property);

        if (!value) {
            return '';
        } else if (typeof value === 'string') {
            return value;
        } else if (typeof value === 'object') {
            return Object.keys(value).length > 0
                ? JSON.stringify(value, null, '\t') + '\n'
                : '';
        } else {
            return value.toString();
        }
    }

    __getNumber(property: string): number {
        const value = this.__get(property);

        return typeof value === 'number'
            ? value
            : Number.parseFloat(this.__getString(property)) || 0;
    }

    __getBoolean(property: string): boolean {
        const value = this.__get(property);

        return typeof value === 'object'
            ? !!(value && Object.keys(value).length > 0)
            : !!value;
    }

    __getArray(property: string): ConfigArray {
        return this.__getField(property).array;
    }

    __forceField(property: string): ConfigField {
        const field = this.__get(property);

        if (field instanceof ConfigField) {
            return field;
        } else {
            this.__set(property, field ? { data: field } : {}, false);

            return this.__getField(property);
        }
    }

    __forceString(property: string): string {
        const value = this.__get(property);

        if (typeof value !== 'string') {
            let returnValue: string;

            if (typeof value === 'object') {
                this.__set(
                    property,
                    (returnValue = JSON.stringify(value)),
                    false
                );
            } else if (value) {
                this.__set(property, (returnValue = '' + value), false);
            } else {
                this.__set(property, (returnValue = ''), false);
            }

            return returnValue;
        } else return value;
    }

    __forceNumber(property: string): number {
        const value = this.__get(property);

        if (typeof value !== 'number' || value <= Number.NEGATIVE_INFINITY) {
            let returnValue: number;

            this.__set(property, (returnValue = (value && +value) || 0), false);

            return returnValue;
        } else return value;
    }

    __forceBoolean(property: string): boolean {
        const value = this.__get(property);

        if (typeof value !== 'boolean') {
            let returnValue: boolean;

            this.__set(property, (returnValue = !!value), false);

            return returnValue;
        } else return value;
    }

    __forceArray(property: string): ConfigArray {
        return this.__forceField(property).array;
    }

    __has(property: string): boolean {
        return property in this;
    }

    __setDefault(...initArray: Array<any>): void {
        for (const init of initArray) {
            if (init && typeof init === 'object') {
                for (const property in init) {
                    const value: any = init[property];

                    if (typeof value === 'object') {
                        const candidate =
                            this.#_data[property] ||
                            this.__set(property, {}, false);
                        const field: ConfigField =
                            candidate instanceof ConfigField
                                ? candidate
                                : (this.__set(
                                      property,
                                      { data: candidate },
                                      false
                                  ),
                                  this.__getField(property));

                        field.__setDefault(value);

                        if (Array.isArray(value)) {
                            field.array;
                        }
                    } else {
                        if (!this.__has(property)) {
                            this.__set(property, value, false);
                        }
                    }
                }

                if (Array.isArray(init)) {
                    this.array;
                }
            } else if (init && !this.__has('value')) {
                this.__set('value', init, false);
            }
        }
    }

    toJSON() {
        return this.#_array ? [...this.#_array] : { ...this.#_data };
    }

    get flat(): Flattened {
        const array = this.#_array;

        if (array) {
            return [...array].map((a) =>
                a instanceof ConfigField ? a.flat : a
            );
        } else {
            const returnValue: {
                [key: string]: Flattened;
            } = {};

            for (const [key, value] of this.map.entries()) {
                returnValue[key] =
                    value instanceof ConfigField ? value.flat : value;
            }

            return returnValue;
        }
    }
}

export default ConfigField;
module.exports = ConfigField;

Object.defineProperties(ConfigField, {
    default: { get: () => ConfigField },
    ConfigField: { get: () => ConfigField },
});
