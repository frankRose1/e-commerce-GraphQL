import formatMoney from '../lib/formatMoney';

describe("formatMoney function", () => {
  it("works with fractional dollars", () => {
    expect(formatMoney(1)).toEqual('$0.01');
    expect(formatMoney(25)).toEqual('$0.25');
    expect(formatMoney(93)).toEqual('$0.93');
  });

  it("leaves cents off for whole dollars", () => {
    expect(formatMoney(500)).toEqual('$5');
    expect(formatMoney(6000)).toEqual('$60');
    expect(formatMoney(50000000)).toEqual('$500,000');
  });

  it("works with fractional and whole dollars", () => {
    expect(formatMoney(5012)).toEqual('$50.12');
    expect(formatMoney(101)).toEqual('$1.01');
    expect(formatMoney(15152526343)).toEqual('$500,000');
  });
});