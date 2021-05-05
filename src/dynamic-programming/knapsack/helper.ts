import fs from "fs";
import Item from "./item";

export const createArr = (file: string): [Item[], number] => {
  const data = fs.readFileSync(file, {
    encoding: "utf8",
    flag: "r",
  });
  let l = true;
  let c = -Infinity;
  let line = "";
  let split = [];
  const arr: Item[] = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== "\n") {
      line += data[i];
    } else {
      if (l) {
        split = line.trim().split(" ");
        c = parseInt(split[0]);
        l = false;
        line = "";
      } else {
        split = line.trim().split(" ");
        const item = {
          value: parseInt(split[0]),
          weight: parseInt(split[1]),
        };
        arr.push(item);
        line = "";
      }
    }
  }
  if (line.trim() !== "") {
    split = line.trim().split(" ");
    const item = {
      value: parseInt(split[0]),
      weight: parseInt(split[1]),
    };
    arr.push(item);
  }
  return [arr, c];
};
