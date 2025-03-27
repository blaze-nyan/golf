/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="next" />
/// <reference types="next/types/global" />

// Override problematic modules
declare module "long" {
  export default class Long {
    constructor(low: number, high?: number, unsigned?: boolean);
    static fromValue(val: any): Long;
    static fromString(str: string, radix?: number): Long;
    static fromNumber(value: number, unsigned?: boolean): Long;
    static fromBits(
      lowBits: number,
      highBits: number,
      unsigned?: boolean
    ): Long;
    toNumber(): number;
    toString(radix?: number): string;
  }
}
