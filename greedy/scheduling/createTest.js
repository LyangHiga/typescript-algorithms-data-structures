const fs = require('fs');

// Returns a random number in [0, max]
const random = (max) => {
  return Math.floor(Math.random() * max) + 1;
};

// create a test set for the scheduling problem
// input: n is the number of pairs (weight,lenght)
//        w: the max val of any weight can have, weight in [0,w]
//        l: the max val of any length can have, length in [0,w]
const create = (n, w, l, fileName) => {
  let data = '';
  for (let i = 0; i < n; i++) {
    data += `${random(w)} ${random(l)}\n`;
  }
  fs.writeFileSync(fileName, data);
};

create(10000, 50, 200, 'test2.txt');
