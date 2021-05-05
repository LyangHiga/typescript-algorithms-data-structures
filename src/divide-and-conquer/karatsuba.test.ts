import karatsuba from "./karatsuba";

describe("Karatsuba Multiplication Test", () => {
  test("easy one", () => {
    expect(8 * 6).toBe(karatsuba(8, 6));
  });

  test("Hard one", () => {
    const A = 807268735638756568837;
    const B = 698653963538725632875;
    expect(A * B).toBe(karatsuba(A, B));
  });
});
