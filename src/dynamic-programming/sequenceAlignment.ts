// TODO: needlemanWunsch implementation! already done in another repo

// inputs: Stirng X and Y
//          sigma for gap penalty
//          Alpha: matrix for mismatch cost
const sq = (
  x: string,
  y: string,
  sigma: number,
  alpha: { [key: string]: { [key: string]: number } }
) => {
  const m = x.length + 1;
  const n = y.length + 1;
  const arr: number[][] = Array.from({ length: x.length + 1 }, () =>
    Array.from({ length: y.length + 1 }, () => Infinity)
  );

  // for empty strings
  for (let i = 0; i < m; i++) arr[i][0] = i * sigma;
  for (let j = 0; j < n; j++) arr[0][j] = j * sigma;

  // case 1: match cost + Xi-1 Yj-1
  // case 2: sigma + Xi-1 Yj
  // case 3: sigma + Xi Yj-1
  for (let j = 1; j < n; j++) {
    for (let i = 1; i < m; i++) {
      arr[i][j] = Math.min(
        alpha[x[i - 1]][y[j - 1]] + arr[i - 1][j - 1],
        sigma + arr[i - 1][j],
        sigma + arr[i][j - 1]
      );
    }
  }
  return arr;
};

// Dummy test
const x = "aaaa";
const y = "aaab";
const sigma = 3;
const alpha = { a: { a: 0, b: 2 }, b: { a: 2, b: 0 } };

console.log(sq(x, y, sigma, alpha));
