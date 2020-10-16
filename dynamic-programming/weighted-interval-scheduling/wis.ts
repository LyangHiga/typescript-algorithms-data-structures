import Interval from "./interval";
import { createArr } from "./helper";

// Add the index of the lefmost interval that ends before j begins
const p = (arr: Interval[]) => {
  // arr is already sorted by finsih time: Ij, Ik => fj < fk
  arr[0].p = 0;
  for (let i = 1; i < arr.length; i++) {
    for (let j = i - 1; j >= 0; j--) {
      if (arr[i].s > arr[j].f) {
        arr[i].p = j;
        break;
      }
    }
  }
  return arr;
};

const wis = (arr: Interval[]) => {
  arr = arr.sort((a, b) => a.f - b.f);
  arr = p(arr);
  // arr is sorted by finish time and p filled
  const m: Array<number> = Array.from({ length: arr.length }, () => 0);
  for (let i = 1; i < m.length; i++) {
    m[i] = Math.max(arr[i - 1].v + m[arr[i - 1].p], m[i - 1]);
  }
  return m;
};

const optS = (arr: Interval[], m: number[]) => {
  const s: number[] = [];
  let i = arr.length - 1;
  while (i > 0) {
    if (arr[i].v + m[arr[i].p] >= m[i - 1]) {
      //CASE 1: Ij is in in S
      s.push(i);
      console.log(arr[i]);
      i = arr[i].p;
    } else {
      //CASE 2: Ij is in S
      i = i - 1;
    }
  }
  return s;
};

const arr = createArr("test2.txt");
const m = wis(arr);
console.log(m[m.length - 1]);
console.log(optS(arr, m));
