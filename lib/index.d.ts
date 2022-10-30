/**
 * Due to historical problems, the calculation process of TiB uses TB characters
 */
declare const binaryMap: {
  b: number;
  kb: number;
  mb: number;
  gb: number;
  tb: number;
  pb: number;
  eb: number;
  zb: number;
};
declare const unitMap: {
  B: string;
  KB: string;
  MB: string;
  GB: string;
  TB: string;
  PB: string;
  EB: string;
  ZB: string;
};
export declare type BinaryMapKeyTypes = keyof typeof binaryMap;
export declare type UnitMapKeyTypes = keyof typeof unitMap;
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
declare function format(value: number, options?: OptionsTypeWithOutSplitUnit): string | null;
declare function format(value: number, options?: OptionsTypeWithSplitUnit): string[] | null;
declare function parse(
  val: string,
  options?: {
    capacityBase?: number;
    convert?: boolean;
  },
): number | null;
declare function parseToUnit(
  value: string,
  toUnit: UnitMapKeyTypes,
  capacityBase?: 1024 | 1000,
): string | null;
declare const bytes: {
  format: typeof format;
  parse: typeof parse;
  parseToUnit: typeof parseToUnit;
};
export default bytes;
