"use strict";
// n jobs to do. Each with some weight (priority) and length
// completion time of job i: sum of lenghts up to job i
// ci = l1 + l2 + ... + li
// Minimize the weighted sum of completion times
// min(w1c1 + w2c2 + ... + wncn)
// Returns the sum of (w1c1 + w2c2 + ... + wncn)
// Inputs: file: name of the test file
//         t: Greedy Criterion (string)
//         t= 'ratio' for weight / length (ratio criterion) as default OR
//         t= 'difference' for weight - length (difference criterion)
const scheduling = (arr, t = "ratio") => {
    // Add greedy criterion property for each job r: ratio or difference
    for (let job of arr) {
        job.v = t === "ratio" ? job.w / job.l : job.w - job.l;
    }
    // sort the arr of jobs in Descending Order of r
    arr.sort((a, b) => b.v - a.v);
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
module.exports = scheduling;
