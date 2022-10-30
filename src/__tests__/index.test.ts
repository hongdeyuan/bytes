import bytes from '../index';

// bytes format
test('bytes format -> fixedDecimals: true', () => {
  expect(bytes.format(1024 * 1024, { fixedDecimals: true })).toBe('1.00MiB');
});

test('bytes format -> fixedDecimals: true  + decimalPlaces: 3', () => {
  expect(
    bytes.format(1024 * 1024, {
      fixedDecimals: true,
      decimalPlaces: 3,
    }),
  ).toBe('1.000MiB');
});

test('bytes format -> thousandsSeparator: string + toUnit: "B"', () => {
  expect(
    bytes.format(1024 * 1024 * 1024, {
      thousandsSeparator: ',',
      toUnit: 'B',
    }),
  ).toBe('1,073,741,824B');
});

test('bytes format -> unitSeparator: " "', () => {
  expect(bytes.format(1024 * 1024, { unitSeparator: ' ' })).toBe('1 MiB');
});

test('bytes format -> withoutFloat: true', () => {
  expect(bytes.format(1024 + 1, { withoutFloat: true })).toBe('1025B');
  expect(bytes.format(1024, { withoutFloat: true })).toBe('1KiB');
});

test('bytes format -> splitUnit: false | true', () => {
  expect(bytes.format(1024 * 1024, { splitUnit: false })).toBe('1MiB');
  expect(bytes.format(1024 * 1024, { splitUnit: true })).toEqual(['1', 'MiB']);
});

test('bytes format -> capacityBase: 1024 | 1000', () => {
  expect(bytes.format(1000 * 1000, { capacityBase: 1024 })).toBe('976.56KiB');
  expect(bytes.format(1000 * 1000, { capacityBase: 1000 })).toBe('1MB');
});

test('bytes format -> value is not isFinite, return null', () => {
  expect(bytes.format(1024 / 0)).toBe(null);
});

// bytes parse
test('bytes parse -> default', () => {
  expect(bytes.parse('10Mb')).toBe(10485760);
});

test('bytes parse -> Mib', () => {
  expect(bytes.parse('10Mib')).toBe(10485760);
});

test('bytes parse -> capacityBase: 1000, convert: false', () => {
  expect(bytes.parse('10MB', { capacityBase: 1000, convert: false })).toBe(10000000);
});

// bytes parseToUnit
test('bytes parseToUnit -> "TB" -> "GB", toUnit: "GB", capacityBase: 1024', () => {
  expect(bytes.parseToUnit('10TB', 'GB', 1024)).toBe('10240GiB');
});

test('bytes parseToUnit -> "TB" -> "GB", toUnit: "GB", capacityBase: 1000', () => {
  expect(bytes.parseToUnit('10TB', 'GB', 1000)).toBe('10000GB');
});
