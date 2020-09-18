// n jobs to do. Each with some weight (priority) and length
// completion time of job i: sum of lenghts up to job i
// ci = l1 + l2 + ... + li
// Minimize the weighted sum of completion times
// min(w1c1 + w2c2 + ... + wncn)
const fs = require('fs');

// Returns an array of jobs from test file
const readTest = (file) => {
  const data = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });
  let line = '';
  let split = [];
  const arr = [];
  for (let char in data) {
    if (data[char] !== '\n') {
      line += data[char];
    } else {
      split = line.split(' ');
      arr.push({ w: parseInt(split[0]), l: parseInt(split[1]) });
      line = '';
    }
  }
  return arr;
};

// Returns the sum of (w1c1 + w2c2 + ... + wncn)
// Inputs: file: name of the test file
//         t: Greedy Criterion (string)
//         t= 'ratio' for weight / length (ratio criterion) as default OR
//         t= 'difference' for weight - length (difference criterion)
const test = (file, t = 'ratio') => {
  let arr = readTest(file);
  // Add greedy criterion property for each job r: ratio or difference
  for (let job of arr) {
    Object.defineProperty(job, 'r', {
      value: t === 'ratio' ? job.w / job.l : job.w - job.l,
      writable: false,
    });
  }
  // sort the arr of jobs in Descending Order of r
  arr.sort((a, b) => b.r - a.r);
  // make the sum w1c1 + w2c2 + ... + wncn
  let c = 0;
  let sum = 0;
  for (let job of arr) {
    // calculate completion time of the ith job
    c += job.l;
    sum += job.w * c;
  }
  return sum;
};

console.log(test('test2.txt'));
console.log(test('test2.txt', 'difference'));
