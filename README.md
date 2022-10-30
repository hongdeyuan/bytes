# Bytes utility

Utility to parse a string bytes (ex: 1 ZiB) to bytes (1.1805916207174113e+21) and vice-versa.

## Installation

```bash
$ npm install @bytes ｜ yarn install @bytes
```

## Usage

```ts
import bytes from '@bytes';
```

#### bytes.format(number value, [options]): string | string[] | null

Format the given value in bytes into a string. If the value is negative, it is kept as such. If it is a float, it is rounded. If options contain splitUnit, string array will be returned.

**Arguments**

| Name    | Type     | Description                                     |
| ------- | -------- | ----------------------------------------------- |
| value   | `number` | Number value to format or string value to parse |
| options | `Object` | Conversion options for `format`                 |

**Options**

| Property           | Type                   | Description                                                                                                       |
| ------------------ | ---------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---- | ---- | ---- | ---- | ---- | ------------------------------ |
| decimalPlaces      | `number`｜`undefined`  | Maximum number of decimal places to include in output. Default value to `2`；Use with fixedDecimals: true         |
| fixedDecimals      | `boolean`｜`undefined` | Whether to always display the maximum number of decimal places. Default value to `false`； Use with decimalPlaces |
| thousandsSeparator | `string`｜`undefined`  | Example of values: `' '`, `','` and `'.'`... Default value to `''`. Use with toUnit                               |
| toUnit             | "B"                    | "KB"                                                                                                              | "MB"                                                                   | "GB" | "TB" | "PB" | "EB" | "ZB" | Convert to specified byte unit |
| unitSeparator      | `string`｜`undefined`  | Separator to use between number and unit. Default value to `''`.Use with splitUnit: false                         |
| withoutFloat       | `boolean`｜`undefined` | Parse size without float：If it cannot be converted to integer byte value, the value displayed in B unit          |
| splitUnit          | `boolean`              | Whether to split byte values and units                                                                            |
| capacityBase       | `number`               | `undefined`                                                                                                       | Conversion base ，It can be set to 1024 or 1000, Default value to 1024 |

**Returns**

| Name    | Type                          | Description                                                   |
| ------- | ----------------------------- | ------------------------------------------------------------- |
| results | `string` ｜`string[]`｜`null` | Return null upon error. string value ; or string array value. |

**Example**

```ts
// fixedDecimals: true
bytes.format(1024 * 1024, { fixedDecimals: true });
// output: '1.00MiB'

// fixedDecimals: true  + decimalPlaces: number
bytes.format(1024 * 1024, {
  fixedDecimals: true,
  decimalPlaces: 3,
});
// output: '1.000MiB'

// toUnit: "B" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB"
bytes.format(1024 * 1024 * 1024, {
  toUnit: 'B',
});
// output: '1073741824B'

// thousandsSeparator: string + toUnit: "B" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB"
bytes.format(1024 * 1024 * 1024, {
  thousandsSeparator: ',', // Thousands separator
  toUnit: 'B',
});
// output: '1,073,741,824B'

// unitSeparator: string
bytes.format(1024 * 1024, { unitSeparator: ' ' });
// output: '1 MiB'

// withoutFloat: true
bytes.format(1024 + 1, {
  withoutFloat: true,
});
// output: 1025B
bytes.format(1024, {
  withoutFloat: true,
});
// output: 1KiB

// splitUnit: false | true
bytes.format(1024 * 1024, { splitUnit: false });
// output: '1MiB'
bytes.format(1024 * 1024, { splitUnit: true });
// output: ['1', 'MiB']

// capacityBase: 1024 | 1000
bytes.format(1000 * 1000, { capacityBase: 1024 }) | format(1000 * 1000);
// output: '976.56KiB'
bytes.format(1000 * 1000, { capacityBase: 1000 });
// output: '1MiB'

// if value is not isFinite, return null;
// output: null
```

#### bytes.parse(string ｜ number value): number ｜ null

Parse the string value into an integer in bytes. If no unit is given, or `value` is a number, it is assumed the value is in bytes.

Supported units and abbreviations are as follows and are case-insensitive:

- `b` for bytes
- `kb` for kilobytes
- `mb` for megabytes
- `gb` for gigabytes
- `tb` for terabytes
- `pb` for petabytes
- `eb` for exabytes
- `zb` for zetbytes

The units are in powers of two, not ten. This means 1kib = 1024b according to this parser.

**Arguments**

| Name  | Type     | Description      |
| ----- | -------- | ---------------- |
| value | `string` | String to parse. |

**Options**

| Name         | Type      | Description |
| ------------ | --------- | ----------- | ---------------------------------------------------------------------- |
| convert      | `boolean` | `undefined` | Convert decimal to binary, Use With capacityBase.                      |
| capacityBase | `number`  | `undefined` | Conversion base ，It can be set to 1024 or 1000, Default value to 1024 |
| needUnit     | `boolean` | `undefined` | When it is true, you can use all options whose value is number         |

**Returns**

| Name    | Type             | Description                                       |
| ------- | ---------------- | ------------------------------------------------- |
| results | `number`｜`null` | Return null upon error. Value in bytes otherwise. |

**Example**

```ts
bytes.parse('10MB', { capacityBase: 1000, convert: false });
// output: 10000000

bytes.parse('10Mb', { convert: true }) | bytes.parse('10Mb');
// output: 10485760

bytes.parse('10Mib');
// output: 10485760

// if parse value isNaN, return null
// output: null
```

### bytes.parseToUnit(string value, toUnit, capacityBase): string | null

Convert byte string to specified unit string.

**Arguments**

| Name         | Type     | Description           |
| ------------ | -------- | --------------------- | --------- | ---------------------------------------------------------------------- | ---- | ---- | ---- | ---- | ------------------------------ |
| value        | `string` | string value to parse |
| toUnit       | "B"      | "KB"                  | "MB"      | "GB"                                                                   | "TB" | "PB" | "EB" | "ZB" | Convert to specified byte unit |
| capacityBase | 1024     | 1000                  | undefined | Conversion base ，It can be set to 1024 or 1000, Default value to 1024 |

**Returns**

| Name    | Type     | Description |
| ------- | -------- | ----------- | --------------------------- |
| results | `string` | `null`      | Convert to byte unit string |

**Example**

```ts
xbytes.parseToUnit('10TB', 'GB', 1024) | xbytes.parseToUnit('10TB', 'GB');
// output: '10000GB'

xbytes.parseToUnit('10TB', 'GB', 1000);
// output: '10000GB'
```

## License

[MIT](LICENSE)
