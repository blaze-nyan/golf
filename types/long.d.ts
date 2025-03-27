declare module "long" {
  export default class Long {
    constructor(low: number, high?: number, unsigned?: boolean);

    static fromValue(val: string | number | Long): Long;
    static fromString(str: string, radix?: number): Long;
    static fromNumber(value: number, unsigned?: boolean): Long;
    static fromBits(
      lowBits: number,
      highBits: number,
      unsigned?: boolean
    ): Long;

    toNumber(): number;
    toString(radix?: number): string;

    // Add other methods as needed

    static ZERO: Long;
    static ONE: Long;
  }
}
