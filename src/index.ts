// TiB convert to TB
// 1 TiB = 1.099511627776 TB = 1099511627776 Byte

// Tebibytes (TiB) 2^40 bytes Terabytes (TB)10^12 bytes
const formatThousandsRegExp = /\B(?=(\d{3})+(?!\d))/g;
const formatDecimalsRegExp = /(?:\.0*|(\.[^0]+)0+)$/;

/**
 * Due to historical problems, the calculation process of TiB uses TB characters
 */
/* tslint:disable:no-bitwise */
const binaryMap = {
  b: 1,
  kb: 1 << 10,
  mb: 1 << 20,
  gb: 1 << 30,
  tb: (1 << 30) * 1024,
  pb: (1 << 30) * Math.pow(1024, 2),
  eb: (1 << 30) * Math.pow(1024, 3),
  zb: (1 << 30) * Math.pow(1024, 4),
};
const decimalMap = {
  b: 1,
  kb: 1000,
  mb: Math.pow(1000, 2),
  gb: Math.pow(1000, 3),
  tb: Math.pow(1000, 4),
  pb: Math.pow(1000, 5),
  eb: Math.pow(1000, 6),
  zb: Math.pow(1000, 7),
};
const unitMap = {
  B: 'B',
  KB: 'KiB',
  MB: 'MiB',
  GB: 'GiB',
  TB: 'TiB',
  PB: 'PiB',
  EB: 'EiB',
  ZB: 'ZiB',
};

export type BinaryMapKeyTypes = keyof typeof binaryMap;
export type UnitMapKeyTypes = keyof typeof unitMap;
export interface OptionsType {
  capacityBase?: number;
  convert?: boolean;
  decimalPlaces?: number;
  fixedDecimals?: boolean;
  needUnit?: boolean;
  splitUnit?: boolean;
  unitSeparator?: string;
  thousandsSeparator?: string;
  toUnit?: UnitMapKeyTypes;
  withoutFloat?: boolean;
}
interface OptionsTypeWithSplitUnit extends OptionsType {
  splitUnit?: true;
}

interface OptionsTypeWithOutSplitUnit extends OptionsType {
  splitUnit?: false;
}

/**
 * Switch base
 * @param {Object} options
 * @returns
 */
function switchBaseMap(capacityBase?: number) {
  if (capacityBase) {
    if (capacityBase === 1000) {
      return decimalMap;
    }
  }
  return binaryMap;
}
/**
 * Switch unit display
 * @param {string} unit
 * @returns
 */
function switchUnit(unit: string, capacityBase?: number) {
  if (capacityBase) {
    if (capacityBase === 1024) {
      return unitMap[unit as UnitMapKeyTypes];
    }
  }
  return unit;
}
const numberIsFinite = (v: number) => isFinite(v);
// The original regular https://www.npmjs.com/package/bytes (There is a bug: when the string '1.2345678901234568e+29GB' is passed in for conversion, the result is 1)
// const parseRegExp = /^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb|eb|zb)$/i;
// 2018-12-19 Compatible scientific notation: 1.2345678901234568e+29
const parseRegExp = /^((-|\+)?(\d+(?:\.\d*[Ee+-]*\d+)?)) *(kb|mb|gb|tb|pb|eb|zb)$/i;

function format(value: number, options?: OptionsTypeWithOutSplitUnit): string | null;
function format(value: number, options?: OptionsTypeWithSplitUnit): string[] | null;
function format(value: number, options?: OptionsTypeWithSplitUnit | OptionsTypeWithOutSplitUnit) {
  if (!numberIsFinite(value)) {
    return null;
  }
  const mag = Math.abs(value);
  const thousandsSeparator =
    options && options.thousandsSeparator ? options.thousandsSeparator : '';
  const unitSeparator = options && options.unitSeparator !== undefined ? options.unitSeparator : '';
  const decimalPlaces = options && options.decimalPlaces !== undefined ? options.decimalPlaces : 2;
  const fixedDecimals = options && options.fixedDecimals;
  // The unit could be specify.
  const toUnit = options && options.toUnit;
  // Split number and unit in array.
  // Parse size without float
  const withoutFloat = options && options.withoutFloat;
  // Conversion base, Default value to 1024
  const capacityBase = options && options.capacityBase !== undefined ? options.capacityBase : 1024;

  let unit: UnitMapKeyTypes = 'B';
  const map = switchBaseMap(capacityBase);
  const keys = Object.keys(map).reverse();
  if (toUnit) {
    unit = toUnit;
  } else if (withoutFloat) {
    const matchUnit = keys.find(
      (k) =>
        map[k as keyof typeof map] &&
        mag >= map[k as keyof typeof map] &&
        Math.round(mag / map[k as keyof typeof map]) === mag / map[k as keyof typeof map],
    );
    if (matchUnit) {
      unit = matchUnit.toUpperCase() as UnitMapKeyTypes;
    }
  } else {
    const matchUnit = keys.find(
      (k) => map[k as keyof typeof map] && mag >= map[k as keyof typeof map],
    );
    if (matchUnit) {
      unit = matchUnit.toUpperCase() as UnitMapKeyTypes;
    }
  }

  const unitSize = map[unit.toLowerCase() as keyof typeof map];

  const val = value / unitSize;
  let str = val.toFixed(decimalPlaces);

  if (!fixedDecimals) {
    str = str.replace(formatDecimalsRegExp, '$1');
  }

  if (thousandsSeparator) {
    str = str.replace(formatThousandsRegExp, thousandsSeparator);
  }
  if (options && options.splitUnit) {
    return [str, switchUnit(unit.toUpperCase(), capacityBase)];
  }
  return str + unitSeparator + switchUnit(unit.toUpperCase(), capacityBase);
}

function parse(val: string, options?: { capacityBase?: number; convert?: boolean }) {
  const value = val.replace(/ /g, '').replace('i', '');
  // Conversion base, Default value to 1024
  const capacityBase = options && options.capacityBase !== undefined ? options.capacityBase : 1024;
  // Convert decimal to binary
  const convert = options && options.convert;
  const results = parseRegExp.exec(value);
  let floatValue: number;
  let unit: BinaryMapKeyTypes;

  if (!results) {
    floatValue = parseInt(value, 10);
    unit = 'b';
  } else {
    floatValue = parseFloat(results[1]);
    unit = results[4].toLowerCase() as BinaryMapKeyTypes;
  }

  if (isNaN(floatValue)) {
    return null;
  }

  const map = switchBaseMap(capacityBase);
  if (capacityBase) {
    if (capacityBase === 1000) {
      if (convert === undefined || convert) {
        // Originally it should be decimal but the binary conversion data is used, and the conversion rate needs to be included.
        floatValue = (floatValue * binaryMap[unit]) / decimalMap[unit];
      }
    }
  }
  return Math.floor(map[unit] * floatValue);
}

function parseToUnit(value: string, toUnit: UnitMapKeyTypes, capacityBase?: 1024 | 1000) {
  const parseVal = parse(value, {
    capacityBase: capacityBase === 1000 ? 1000 : 1024,
    convert: capacityBase === 1000 ? false : true,
  });
  return typeof parseVal === 'number' ? format(parseVal, { capacityBase, toUnit }) : null;
}

const bytes = {
  format,
  parse,
  parseToUnit,
};

export default bytes;
