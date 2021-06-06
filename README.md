# doge-config

## What is this?

### It is the *easiest* way to read/write to a config file.

### It provides optional type-safe accessors.

## How do I use this?

```
const field: Config | ConfigField;

field.__set(key: string, value: string | boolean | number | object, save: boolean): value;

field.__get(key: string): ConfigField | string | number | boolean | null;
field.__getString(key: string): string;
field.__getNumber(key: string): number;
field.__getBoolean(key: string): boolean;

field.__getField(key: string): ConfigField;
field.__getArray(key: string): ConfigArray;

field.__force<type>(key: string): <type>;
// same as __get<type>, but overwrites the type saved in the config

// Array-like accessor
field.array: ConfigArray;

// Map-like accessor
field.map: ConfigMap

// Type-safe object-like accessors
field.data: { [key]: any }
field.bool: { [key]: boolean }
field.str: { [key]: string }
field.num: { [key]: number }
field.obj: { [key]: ConfigField }

field.__save(): void;
```

### JavaScript

```
const { getConfig } = require('doge-config');

const config = getConfig('foo', { optional: [ 'default', 'values' ] });

const directly_accessed = config.optional[0] // 'default'

const queried = config.optional.__getString(0); // 'default'

const array = config.optional.array; // [ 'default', 'values' ]

config.foo = 'bar'; // 'bar'

config.save(); // write to disk

getConfig('foo').__getField('foo').__getArray('data').pop(); // undefined, we didn't use __set()
```

### TypeScript

```
import { getConfig } from 'doge-config';

const config = getConfig('foo', { optional: [ 'default', 'values' ] });

const type_safe = config.__getField('optional').__getString('0'); // 'default'

const array = config.__getArray('optional'); // [ 'default', 'values' ]

config.__set('foo', 'bar', false); // Third parameter decides auto-save

config.save(); // Write to disk

getConfig('foo').__getField('foo').__getArray('data').pop(); // 'bar'
```
