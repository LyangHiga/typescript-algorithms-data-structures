const Graph = require('./graph');

const g = new Graph();

g.create('list.txt');
console.log(g.prim('1'));
