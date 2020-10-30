"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsp_nnh = exports.tsp_bfs = void 0;
// Euclidian Distance
const distance = (a, b) => {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};
//   **********************************************************
//                         BFS HELPERS
//   **********************************************************
// input: Array of Cities
// Return: All cities permutations n! arrays of cities (aka arrays of Tours )
// Reference: https://stackoverflow.com/questions/9960908/permutations-in-javascript
const permutator = (inputArr) => {
    let result = [];
    const permute = (arr, m = []) => {
        if (arr.length === 0) {
            result.push(m);
        }
        else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next));
            }
        }
    };
    permute(inputArr);
    return result;
};
// Input: Tour (remember to connect the last city wuth the 1ts one )
// return: Tour cost
const tourCost = (tour) => {
    let d = 0;
    for (let i = 0; i < tour.length - 1; i++) {
        d += distance(tour[i], tour[i + 1]);
    }
    d += distance(tour[tour.length - 1], tour[0]);
    return d;
};
// Input: array of tours
// Return min tour cost and the min tour itself
const minTour = (tourArr) => {
    let min = Infinity;
    let minT = [];
    for (let tour of tourArr) {
        const d = tourCost(tour);
        if (d < min) {
            min = d;
            minT = tour;
        }
    }
    return { min, minTour };
};
// Return min Tour cost and min Tour
// Brute-force Search
exports.tsp_bfs = (arr) => {
    // make all (n)! permutaions
    const permutations = permutator(arr);
    // return min cost, min tour cost
    return minTour(permutations);
};
//   **********************************************************
//                         NNH HELPERS
//   **********************************************************
// Input: Arr of available cities
// Return: distance between the current City c and its closest city
//         index of the closest one
const closestCity = (c, arr) => {
    let min = Infinity;
    let idx = null;
    for (let i = 0; i < arr.length; i++) {
        const d = distance(c, arr[i]);
        if (d < min) {
            min = d;
            idx = i;
        }
    }
    return { min, idx };
};
// return cost and tour
// nearest neighbor heuristic
exports.tsp_nnh = (arr) => {
    // start at 1st city
    // keep track of available cities using arr
    const tour = [arr[0]];
    let cost = 0;
    // remove 1st city of available cities
    [arr[0], arr[arr.length - 1]] = [arr[arr.length - 1], arr[0]];
    // current city
    let c = arr.pop();
    while (arr.length > 0) {
        const { min, idx } = closestCity(c, arr);
        cost += min;
        // remove next city of arr (availble cities) and add tour
        [arr[idx], arr[arr.length - 1]] = [arr[arr.length - 1], arr[idx]];
        c = arr.pop();
        tour.push(c);
    }
    cost += distance(tour[tour.length - 1], tour[0]);
    return { cost, tour };
};
