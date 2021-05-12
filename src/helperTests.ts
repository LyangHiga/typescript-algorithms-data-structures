import * as fs from "fs";

export const getTestAnswer = (file: string): number => {
  const data = fs.readFileSync(file, {
    encoding: "utf8",
    flag: "r",
  });
  let line = "";
  for (let i = 0; i < data.length; i++) {
    line += data[i];
  }
  return parseInt(line);
};

export const getTestAnswerArr = (file: string): number[] => {
  const data = fs.readFileSync(file, {
    encoding: "utf8",
    flag: "r",
  });
  let line = "";
  for (let i = 0; i < data.length; i++) {
    line += data[i];
  }
  const arr = line.split(",");
  return arr.map((x) => +x);
};

export const createArr = (file: string): number[] => {
  const data = fs.readFileSync(file, {
    encoding: "utf8",
    flag: "r",
  });
  let line = "";
  const arr = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== "\n") {
      line += data[i];
    } else {
      arr.push(parseInt(line));
      line = "";
    }
  }
  if (line.trim() !== "") arr.push(parseInt(line));
  return arr;
};

export const createHT = (file: string) => {
  const data = fs.readFileSync(file, { encoding: "utf8", flag: "r" });
  let line = "";
  const ht = new Map();
  let t;
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== "\n") {
      line += data[i];
    } else {
      ht.set(parseInt(line), true);
      line = "";
    }
  }
  if (line.trim() !== "") ht.set(parseInt(line), true);
  return ht;
};

export const createCitiesArr = (file: string, f = true, tp = false) => {
  const data = fs.readFileSync(`input_${file}`, {
    encoding: "utf8",
    flag: "r",
  });
  let line = "";
  let split = [];
  const arr = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i] !== "\n") {
      line += data[i];
    } else {
      const c = { x: 0, y: 0 };
      split = line.trim().split(" ");
      if (f) {
        if (!tp) {
          c.x = parseFloat(split[0]);
          c.y = parseFloat(split[1]);
        } else {
          c.x = parseFloat(split[1]);
          c.y = parseFloat(split[2]);
        }
      } else {
        c.x = parseInt(split[0]);
        c.y = parseInt(split[1]);
      }
      arr.push(c);
      line = "";
    }
  }
  return arr;
};
