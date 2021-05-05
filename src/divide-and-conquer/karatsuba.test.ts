import karatsuba from "./karatsuba";

describe("Karatsuba Multiplication Test", () => {
  test("easy one", () => {
    expect(karatsuba(8, 6)).toBe(8 * 6);
  });

  test("Hard one", () => {
    const A = 807268735638756568837;
    const B = 698653963538725632875;
    expect(karatsuba(A, B)).toBe(A * B);
  });

  test("multiplication commutative", () => {
    const A = 4573;
    const B = 1748;
    const C = 9473;
    expect(karatsuba(karatsuba(A, B), C)).toBe(karatsuba(karatsuba(C, B), A));
    expect(karatsuba(karatsuba(A, B), C)).toBe(A * B * C);
  });

  test("Zero Multiplication", () => {
    const A = 807268735638756568837;
    expect(karatsuba(A, 0)).toBe(0);
  });

  test("One Multiplication", () => {
    const A = 807268735638756568837;
    expect(karatsuba(A, 1)).toBe(A);
  });
});
