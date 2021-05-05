import fs from "fs";
import Job from "./job";

// Returns an array of jobs from test file
const readTest = (file: string) => {
  const data = fs.readFileSync(file, { encoding: "utf8", flag: "r" });
  let line = "";
  let split: string[] = [];
  const arr: Job[] = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== "\n") {
      line += data[i];
    } else {
      split = line.split(" ");
      arr.push({ w: parseInt(split[0]), l: parseInt(split[1]) });
      line = "";
    }
  }
  return arr;
};

export = readTest;
