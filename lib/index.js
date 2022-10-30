'use strict';
// TiB convert to TB
// 1 TiB = 1.099511627776 TB = 1099511627776 Byte
Object.defineProperty(exports, '__esModule', { value: true });
// Tebibytes (TiB) 2^40 bytes Terabytes (TB)10^12 bytes
var formatThousandsRegExp = /\B(?=(\d{3})+(?!\d))/g;
var formatDecimalsRegExp = /(?:\.0*|(\.[^0]+)0+)$/;
/**
 * Due to historical problems, the calculation process of TiB uses TB characters
 */
/* tslint:disable:no-bitwise */
var binaryMap = {
  b: 1,
  kb: 1 << 10,
  mb: 1 << 20,
  gb: 1 << 30,
  tb: (1 << 30) * 1024,
  pb: (1 << 30) * Math.pow(1024, 2),
  eb: (1 << 30) * Math.pow(1024, 3),
  zb: (1 << 30) * Math.pow(1024, 4),
};
var decimalMap = {
  b: 1,
  kb: 1000,
  mb: Math.pow(1000, 2),
  gb: Math.pow(1000, 3),
  tb: Math.pow(1000, 4),
  pb: Math.pow(1000, 5),
  eb: Math.pow(1000, 6),
  zb: Math.pow(1000, 7),
};
var unitMap = {
  B: 'B',
  KB: 'KiB',
  MB: 'MiB',
  GB: 'GiB',
  TB: 'TiB',
  PB: 'PiB',
  EB: 'EiB',
  ZB: 'ZiB',
};
/**
 * Switch base
 * @param {Object} options
 * @returns
 */
function switchBaseMap(capacityBase) {
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
function switchUnit(unit, capacityBase) {
  if (capacityBase) {
    if (capacityBase === 1024) {
      return unitMap[unit];
    }
  }
  return unit;
}
var numberIsFinite = function (v) {
  return isFinite(v);
};
// The original regular https://www.npmjs.com/package/bytes (There is a bug: when the string '1.2345678901234568e+29GB' is passed in for conversion, the result is 1)
// const parseRegExp = /^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb|eb|zb)$/i;
// 2018-12-19 Compatible scientific notation: 1.2345678901234568e+29
var parseRegExp = /^((-|\+)?(\d+(?:\.\d*[Ee+-]*\d+)?)) *(kb|mb|gb|tb|pb|eb|zb)$/i;
function format(value, options) {
  if (!numberIsFinite(value)) {
    return null;
  }
  var mag = Math.abs(value);
  var thousandsSeparator = options && options.thousandsSeparator ? options.thousandsSeparator : '';
  var unitSeparator = options && options.unitSeparator !== undefined ? options.unitSeparator : '';
  var decimalPlaces = options && options.decimalPlaces !== undefined ? options.decimalPlaces : 2;
  var fixedDecimals = options && options.fixedDecimals;
  // The unit could be specify.
  var toUnit = options && options.toUnit;
  // Split number and unit in array.
  // Parse size without float
  var withoutFloat = options && options.withoutFloat;
  // Conversion base, Default value to 1024
  var capacityBase = options && options.capacityBase !== undefined ? options.capacityBase : 1024;
  var unit = 'B';
  var map = switchBaseMap(capacityBase);
  var keys = Object.keys(map).reverse();
  if (toUnit) {
    unit = toUnit;
  } else if (withoutFloat) {
    var matchUnit = keys.find(function (k) {
      return map[k] && mag >= map[k] && Math.round(mag / map[k]) === mag / map[k];
    });
    if (matchUnit) {
      unit = matchUnit.toUpperCase();
    }
  } else {
    var matchUnit = keys.find(function (k) {
      return map[k] && mag >= map[k];
    });
    if (matchUnit) {
      unit = matchUnit.toUpperCase();
    }
  }
  var unitSize = map[unit.toLowerCase()];
  var val = value / unitSize;
  var str = val.toFixed(decimalPlaces);
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
function parse(val, options) {
  var value = val.replace(/ /g, '').replace('i', '');
  // Conversion base, Default value to 1024
  var capacityBase = options && options.capacityBase !== undefined ? options.capacityBase : 1024;
  // Convert decimal to binary
  var convert = options && options.convert;
  var results = parseRegExp.exec(value);
  var floatValue;
  var unit;
  if (!results) {
    floatValue = parseInt(value, 10);
    unit = 'b';
  } else {
    floatValue = parseFloat(results[1]);
    unit = results[4].toLowerCase();
  }
  if (isNaN(floatValue)) {
    return null;
  }
  var map = switchBaseMap(capacityBase);
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
function parseToUnit(value, toUnit, capacityBase) {
  var parseVal = parse(value, {
    capacityBase: capacityBase === 1000 ? 1000 : 1024,
    convert: capacityBase === 1000 ? false : true,
  });
  return typeof parseVal === 'number'
    ? format(parseVal, { capacityBase: capacityBase, toUnit: toUnit })
    : null;
}
var bytes = {
  format: format,
  parse: parse,
  parseToUnit: parseToUnit,
};
exports.default = bytes;
