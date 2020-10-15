import fs from "fs";
import Interval from "./interval";

// Returns a random number between [min,max)
const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

// create a test set for the scheduling problem
// input: n is the number of Intervals (start,finish,value)
//        s: the max val of any start time an Interval can have, s in [0,w]
//        f: the max val of any finsish time an Interval can have, f in [0,w]
//        v: the max val of any value an Interval can have, v in [0,w]
const create = (
  n: number,
  s: number,
  f: number,
  v: number,
  fileName: string
) => {
  let data = "";
  for (let i = 0; i < n; i++) {
    const st = random(0, s);
    let ft = random(st, f);
    if (ft === st) ft = ft + 1;
    data += `${st} ${ft} ${random(1, v)}\n`;
  }
  fs.writeFileSync(fileName, data);
};

export const createArr = (file: string): Interval[] => {
  const data = fs.readFileSync(file, {
    encoding: "utf8",
    flag: "r",
  });
  let line = "";
  let split = [];
  const arr: Interval[] = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== "\n") {
      line += data[i];
    } else {
      split = line.trim().split(" ");
      const inter = {
        s: parseInt(split[0]),
        f: parseInt(split[1]),
        v: parseInt(split[2]),
        p: 0,
      };
      arr.push(inter);
      line = "";
    }
  }
  if (line.trim() !== "") {
    split = line.trim().split(" ");
    const inter = {
      s: parseInt(split[0]),
      f: parseInt(split[1]),
      v: parseInt(split[2]),
      p: 0,
    };
    arr.push(inter);
  }
  return arr;
};

create(100000, 23, 24, 100, "test2.txt");
