"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const queue_1 = __importDefault(require("./basics/queue"));
const stack_1 = __importDefault(require("./basics/stack"));
const minHeap_1 = __importDefault(require("./heaps/minHeap"));
const fibonacciHeap_1 = __importDefault(require("./heaps/fibonacciHeap"));
const fs_1 = __importDefault(require("fs"));
// Returns a random number between [min,max)
const random = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};
class Graph {
    constructor(directed = false) {
        this.directed = directed;
        //   **********************************************************
        //                            HELPERS
        //   **********************************************************
        // print this Graph
        //   FORMAT: <first vertex u> - <second vertex v> - <edge w>
        this.print = () => {
            for (let u in this.list) {
                for (let v in this.list[u]) {
                    if (!this.directed) {
                        if (this.list[u][v].weight) {
                            console.log(`${u} - ${this.list[u][v].node} - ${this.list[u][v].weight}`);
                        }
                        else {
                            console.log(`${u} - ${this.list[u][v].node}`);
                        }
                    }
                    else {
                        if (this.list[u][v].weight) {
                            console.log(`${u} -> ${this.list[u][v].node} - ${this.list[u][v].weight}`);
                        }
                        else {
                            console.log(`${u} -> ${this.list[u][v].node}`);
                        }
                    }
                }
            }
        };
        // Returns true if this list constains this vertex (key v)
        // Otherwise returns false
        this.contains = (v) => {
            if (this.list[v] === undefined)
                return false;
            return true;
        };
        // Returns true if v is a neighbour of u
        // otherwise returns false
        this.isNeighbour = (u, v) => {
            // check if u is already in this list
            if (!this.contains(u))
                return false;
            // if v is already in list[u] return true
            for (let i = 0; i < this.list[u].length; i++) {
                if (this.list[u][i].node === v)
                    return true;
            }
            return false;
        };
        // Returns how many edges are between verteces u and v
        this.hme = (u, v) => {
            let c = 0;
            for (let i = 0; i < this.list[u].length; i++) {
                if (this.list[u][i].node === v)
                    c++;
            }
            return c;
        };
        // Returns the number of edges of this graph
        this.countEdges = () => {
            let c = 0;
            for (let u in this.list) {
                for (let v in this.list[u]) {
                    c++;
                }
            }
            return c / 2;
        };
        // Returns the key of two neighbours [u,v]
        this.pickRandomEdge = () => {
            const keys = Object.keys(this.list);
            const uIdx = random(0, keys.length);
            const u = keys[uIdx];
            const vIdx = random(0, this.list[u].length);
            const v = this.list[u][vIdx].node;
            return [u, v];
        };
        // Merge two verteces into a single one
        this.mergeVerteces = (u, v) => {
            // adds all neighbours of v to u
            // and removes from v
            while (this.contains(v) && this.size > 2 && this.contains(u)) {
                const w = this.list[v][0].node;
                // not allow self-loops
                if (w !== u) {
                    if (this.contains(w) && this.contains(u)) {
                        // we need to add (u,w) the same number of times that we remove (v,w)
                        const c = this.hme(v, w);
                        for (let i = 0; i < c; i++) {
                            this.addEdge(u, w);
                        }
                    }
                }
                this.removeEdge(v, w);
                // if v or w does not have any other neighbour remove it from this graph
                this.removeDegreeZero(v);
                this.removeDegreeZero(w);
            }
        };
        // Returns a new directed Graph with all edges of this reversed
        this.reverse = () => {
            // if this is not a directed graph returns false
            if (!this.directed)
                return false;
            const g = new Graph(true);
            for (let u in this.list) {
                for (let v in this.list[u]) {
                    if (this.list[u][v].weight) {
                        g.addVertecesAndEdge(this.list[u][v].node, u, this.list[u][v].weight);
                    }
                    else {
                        g.addVertecesAndEdge(this.list[u][v].node, u);
                    }
                }
            }
            return g;
        };
        //   **********************************************************
        //                            INSERT
        //   **********************************************************
        // Adds an empty array to the new vertice v
        // Returns this list
        // If v is already in this list do nothing
        this.addVertex = (v) => {
            if (!this.list[v]) {
                this.list[v] = [];
                this.size++;
                return this;
            }
            // if v is already in this list do nothing
            return;
        };
        // adds v to neighbour list of u
        // ( and v to u neighbour list if it's a undirected graph )
        // O(1) - but dont check for duplications
        // DONT PASS DUPLICATES !
        this.addEdge = (u, v, weight = 0) => {
            // unweighted graph
            if (weight === 0) {
                this.list[u].push({ node: v });
                if (!this.directed)
                    this.list[v].push({ node: u });
                return this;
            }
            // weighted graph
            this.list[u].push({ node: v, weight });
            if (!this.directed)
                this.list[v].push({ node: u, weight });
            return this;
        };
        // Adds both u and v verteces and their edge w
        this.addVertecesAndEdge = (u, v, w = 0) => {
            this.addVertex(u);
            this.addVertex(v);
            this.addEdge(u, v, w);
        };
        //   **********************************************************
        //                            DELETE
        //   **********************************************************
        // Removes v from neighbour list of u (and v from u neighbour list if undirected)
        // Returns this list
        this.removeEdge = (u, v) => {
            this.list[u] = this.list[u].filter((w) => w.node !== v);
            if (!this.directed) {
                this.list[v] = this.list[v].filter((w) => w.node !== u);
            }
            return this;
        };
        // Removes all edges of v and v itself
        //  Returns this list
        this.removeVertex = (v) => {
            while (this.list[v].length) {
                const u = this.list[v].pop();
                this.removeEdge(u, v);
            }
            delete this.list[v];
            this.size--;
            return this;
        };
        // If u does not have any neighbour, iow has degree zero
        // Removes u
        // Returns this graph
        // Returns false if u is not in this graph
        this.removeDegreeZero = (u) => {
            if (!this.contains(u))
                return false;
            if (this.list[u].length === 0) {
                // if v was the only neighbour of v (the adj list of u is now empty)
                // removes u
                this.removeVertex(u);
            }
            return this;
        };
        //   **********************************************************
        //                            CREATING
        //   **********************************************************
        // Add all verteces and edges to this graph from a file
        // File is the adj list of this Graph
        // FORMAT: <first vertex u>' '<second vertex v>' ' <edge w>
        this.create = (file) => {
            // check if this is a 'empty graph'
            if (this.size !== 0)
                return false;
            const data = fs_1.default.readFileSync(file, { encoding: "utf8", flag: "r" });
            let line = "";
            let split = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i] !== "\n") {
                    line += data[i];
                }
                else {
                    split = line.trim().split(" ");
                    this.addVertecesAndEdge(split[0], split[1], parseInt(split[2]));
                    line = "";
                }
            }
            // check if the last line is empty
            if (line !== "") {
                split = line.trim().split(" ");
                this.addVertecesAndEdge(split[0], split[1], parseInt(split[2]));
            }
        };
        // Add all verteces and edges to this graph from a file
        // File is the adj list of this Graph
        // FORMAT: <vertex u>' => neighbours: '<vertex v>' ... '<vertex n>'
        // This format allow duplicate edges, we need to handle
        this.createListAdj = (file) => {
            // check if this is a 'empty graph'
            if (this.size !== 0)
                return false;
            const data = fs_1.default.readFileSync(file, { encoding: "utf8", flag: "r" });
            let line = "";
            let split = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i] !== "\n") {
                    line += data[i];
                }
                else {
                    split = line.trim().split(" ");
                    const u = split[0];
                    while (split.length > 1) {
                        const v = split.pop();
                        // to avoid duplicate edges
                        if (!this.isNeighbour(u, v)) {
                            // whether v is not neighbour of u
                            this.addVertecesAndEdge(u, v);
                        }
                    }
                    line = "";
                }
            }
            // check if the last line is empty
            if (line !== "") {
                split = line.trim().split(" ");
                const u = split[0];
                while (split.length > 1) {
                    const v = split.pop();
                    // to avoid duplicate edges
                    if (!this.isNeighbour(u, v)) {
                        // whether v is not neighbour of u
                        this.addVertecesAndEdge(u, v);
                    }
                }
            }
        };
        // Add all verteces and edges to this graph from a file
        // File is the adj list of this Graph
        // FORMAT: <vertex u>' => neighbours: '<vertex v>,weight' ... '<vertex n>,weight'
        // This format allow duplicate edges, we need to handle
        this.createListAdjWeighted = (file) => {
            // check if this is a 'empty graph'
            if (this.size !== 0)
                return false;
            const data = fs_1.default.readFileSync(file, { encoding: "utf8", flag: "r" });
            let line = "";
            let split = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i] !== "\n") {
                    line += data[i];
                }
                else {
                    split = line.trim().split("	");
                    const u = split[0];
                    while (split.length > 1) {
                        const t = split.pop();
                        const v = t.split(",");
                        // to avoid duplicate edges
                        if (!this.isNeighbour(u, v[0])) {
                            // whether v is not neighbour of u
                            this.addVertecesAndEdge(u, v[0], parseInt(v[1]));
                        }
                    }
                    line = "";
                }
            }
            // check if the last line is empty
            if (line !== "") {
                split = line.trim().split("	");
                const u = split[0];
                while (split.length > 1) {
                    const t = split.pop();
                    const v = t.split(",");
                    // to avoid duplicate edges
                    if (!this.isNeighbour(u, v[0])) {
                        // whether v is not neighbour of u
                        this.addVertecesAndEdge(u, v[0], parseInt(v[1]));
                    }
                }
            }
        };
        // Add all verteces and edges to this graph from a file
        // File is the adj list of this Graph
        // FORMAT: <first vertex u>' '<second vertex v>
        // it is a drirected graph, the edge goes from u to v, i.e.: u -> v
        this.createDirected = (file) => {
            // check if this is a 'empty graph'
            if (this.size !== 0)
                return false;
            // set this graph as directed
            this.directed = true;
            const data = fs_1.default.readFileSync(file, { encoding: "utf8", flag: "r" });
            let line = "";
            let split = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i] !== "\n") {
                    line += data[i];
                }
                else {
                    split = line.trim().split(" ");
                    this.addVertecesAndEdge(split[0], split[1]);
                    line = "";
                }
            }
            // check if the last line is empty
            if (line !== "") {
                split = line.trim().split(" ");
                this.addVertecesAndEdge(split[0], split[1]);
            }
        };
        //   **********************************************************
        //                            ALGORITHMS
        //   **********************************************************
        // Returns a min cut
        // We need to execute a sufficient number of times to have a high prob to find the min cut
        this.kargerMinCut = () => {
            while (this.size > 2) {
                // pick a random edge
                const [u, v] = this.pickRandomEdge();
                // contract randomly edges (u,v) until only two verteces remain
                this.mergeVerteces(u, v);
            }
            return this.countEdges();
        };
        // Returns: a list of all verteces found (in the order of dequeue)
        //    the parent of each visited vertex
        //    the distance of s to each visited vertex
        //    all visited verteces
        this.bfs = (s) => {
            // the order of each vertex is dequeue (Array of Keys)
            const result = new Array();
            // Maps the key of each vertex to its distance from vertex s
            const dist = new Map();
            // Maps the key of each vertex to its parents key
            const parents = new Map();
            const visited = new Map();
            const q = new queue_1.default();
            // add s to the queue
            q.enQueue(s);
            // mark s as visited
            visited.set(s, true);
            dist.set(s, 0);
            parents.set(s, null);
            let v;
            while (q.size !== 0) {
                v = q.deQueue();
                result.push(v.key);
                this.list[v.key].forEach((u) => {
                    // if u unvisited
                    if (!visited.get(u.node)) {
                        // mark u as visited
                        visited.set(u.node, true);
                        // add u to the queue
                        q.enQueue(u.node);
                        parents.set(u.node, v.key);
                        dist.set(u.node, dist.get(v.key) + 1);
                    }
                });
            }
            return { result, parents, dist, visited };
        };
        // Returns a list with all connected components of G
        this.undirectConnectivity = () => {
            const components = new Array();
            const isVisited = new Map();
            // a single component after to execute one bfs
            for (let u in this.list) {
                // check if node u was already visited before
                if (!isVisited.get(u)) {
                    const { result, visited } = this.bfs(u);
                    // updtade visited nodes after this bfs
                    visited.forEach((value, key) => {
                        isVisited.set(key, value);
                    });
                    // add this new result
                    components.push(result);
                }
            }
            return components;
        };
        // dfs iterative
        this.dfs = (s) => {
            const result = new Array();
            const dist = new Map();
            const parents = new Map();
            const visited = new Map();
            // key to label order
            const labeledOrder = new Map();
            // finish order
            const finish = new Array();
            const stack = new stack_1.default();
            // add s tothe stack
            stack.push(s);
            // mark s as visited
            visited.set(s, true);
            dist.set(s, 0);
            let v;
            let i = 0;
            while (stack.size !== 0) {
                // take from the top of the stack
                v = stack.pop();
                result.push(v.key);
                // add parent of v wich is the last one poped
                if (i === 0) {
                    parents.set(v.key, null);
                }
                else {
                    parents.set(v.key, result[i - 1]);
                }
                i++;
                // for every edge of v
                this.list[v.key].forEach((u) => {
                    //  v unvisited
                    if (!visited.get(u.node)) {
                        // mark u as visited
                        visited.set(u.node, true);
                        // add u to the stack
                        stack.push(u.node);
                        // calc dist
                        dist.set(u.node, dist.get(v.key) + 1);
                    }
                });
                if (!labeledOrder.get(v.key)) {
                    labeledOrder.set(v.key, this.currentLabel);
                    this.currentLabel++;
                    finish.push(v.key);
                }
            }
            return {
                result,
                parents,
                dist,
                labeledOrder,
                visited,
                finish,
            };
        };
        // Returns the size of each Strong Component
        // the id of each SC is its Leader
        this.kojaru = () => {
            // reverse G
            const gRerv = this.reverse();
            // finish order
            if (gRerv === false)
                return false;
            const { finish } = gRerv.topologicalSort();
            const visited = new Map();
            // the vertex who calls dfs (maps leader's vertex key to the size of the Strong Component)
            const leader = new Map();
            let u, r;
            for (let i = finish.length - 1; i > 0; i--) {
                u = finish[i];
                if (!visited.get(u)) {
                    r = this.dfs(u);
                    // update visited
                    r.visited.forEach((value, key) => {
                        visited.set(key, value);
                    });
                    // all verteces visited have u as leader
                    leader.set(u, r.result.length);
                }
            }
            return leader;
        };
        // Returns the distance from s to each vertex and their parents
        // Inputs:
        //    s: source vertex
        //    h: to choose between binary and fibonacci heap
        //     'b' (default) for binaryHeap
        //     'f' for FibonacciHeap
        this.dijkstra = (s, h = "b") => {
            let heap;
            switch (h) {
                case "b":
                // any value of h different than "b" and "h"
                default:
                    // we should use 'var' declaration get a function scope
                    heap = new minHeap_1.default();
                case "f":
                    heap = new fibonacciHeap_1.default();
                    // to keep track of node to make decrease key when distances get smaller
                    // FIXME: map node key to Node itself
                    var pointers = new Map();
            }
            let dequeues = 0;
            // objs to map key to distance and key to parents
            const distances = new Map();
            const parents = new Map();
            // FIXME: type Node
            let smallest;
            for (let vertex in this.list) {
                if (vertex !== s) {
                    distances.set(vertex, Infinity);
                }
            }
            distances.set(s, 0);
            heap.enqueue(s, 0);
            parents.set(s, null);
            // FIXME: boolean or heap Node
            let deacrease = false;
            // while we have nodes to visite:
            while (!heap.isEmpty()) {
                smallest = heap.dequeue().key;
                //   console.log(`smallest: ${smallest}, dist: ${distances[smallest]}`);
                dequeues++;
                if (smallest || distances.get(smallest) !== Infinity) {
                    for (let neighbour in this.list[smallest]) {
                        let nextNode = this.list[smallest][neighbour];
                        // calculate Dijkstra's  Greedy Criterium
                        let d = distances.get(smallest) + nextNode.weight;
                        //   compare distance calculated with last distance storaged
                        if (d < distances.get(nextNode.node)) {
                            //   updating distances and parents
                            distances.set(nextNode.node, d);
                            parents.set(nextNode.node, smallest);
                            // try to deacrease key
                            if (h === "b") {
                                // binary heap we just need the key of the node to be decreased
                                deacrease = heap.decreaseKey(nextNode.node, d);
                            }
                            else {
                                //FH we need a pointer to the node to be decreased
                                deacrease = heap.decreaseKey(pointers.get(nextNode.node), d);
                                // heap.enqueue(nextNode.node, d);
                            }
                            if (!deacrease) {
                                // if this node is not in heap(wasn't decrease) add to the Heap
                                if (h === "f") {
                                    const node = heap.enqueue(nextNode.node, d);
                                    pointers.set(nextNode.node, node);
                                }
                                else {
                                    heap.enqueue(nextNode.node, d);
                                }
                            }
                            else {
                                if (h === "f") {
                                    pointers.set(nextNode.node, deacrease);
                                }
                            }
                        }
                    }
                }
            }
            console.log(`dequeues: ${dequeues},size: ${this.size}, h.size: ${heap.size}`);
            return { distances, parents };
        };
        // Returns the MST and its cost
        this.prim = (s) => {
            let heap = new minHeap_1.default();
            const mst = new Graph();
            // map to keep track what element is already in mst
            // we dont need this in Dijkstra because dist always encrease
            const mstSet = new Map();
            const edgeCost = new Map();
            const parents = new Map();
            // sum of each MST's edge
            let cost = 0;
            let dequeues = 0;
            let smallest;
            let deacrease = false;
            for (let vertex in this.list) {
                if (vertex !== s) {
                    edgeCost.set(vertex, Infinity);
                    mstSet.set(vertex, false);
                }
            }
            edgeCost.set(s, 0);
            heap.buildHeap(edgeCost);
            parents.set(s, null);
            mstSet.set(s, true);
            while (!heap.isEmpty()) {
                smallest = heap.dequeue().key;
                dequeues++;
                //   we found the min cost to add smallest in our MST
                cost += edgeCost.get(smallest);
                mst.addVertex(smallest);
                mstSet.set(smallest, true);
                if (parents.get(smallest)) {
                    //   if smallest has a parent (is not the start node) add the edge to mst
                    mst.addEdge(smallest, parents.get(smallest), edgeCost.get(smallest));
                }
                if (smallest || edgeCost.get(smallest) !== Infinity) {
                    for (let neighbour in this.list[smallest]) {
                        let nextNode = this.list[smallest][neighbour];
                        // compare the cost of this edge with the last one storaged
                        //   and check if this node is already in mstSet
                        if (nextNode.weight < edgeCost.get(nextNode.node) &&
                            !mstSet.get(nextNode.node)) {
                            //   updating edgeCost and parents
                            edgeCost.set(nextNode.node, nextNode.weight);
                            parents.set(nextNode.node, smallest);
                            // try to deacrease key, if isConnect always will decrease
                            deacrease = heap.decreaseKey(nextNode.node, nextNode.weight);
                        }
                    }
                }
            }
            console.log(`dequeues: ${dequeues}, size: ${this.size}, h.size: ${heap.size}`);
            return { cost, mst };
        };
        this.list = {};
        // this.list = new Map();
        // to implement topologicalSort
        this.currentLabel = null;
        this.size = 0;
    }
    // Returns the labeled order and finish order
    // Does not work for cycled graphs, only DAGs
    topologicalSort() {
        const labeledOrder = new Map();
        const visited = new Map();
        const finish = new Array();
        // to keep track of ordering
        this.currentLabel = 0;
        let r;
        for (let u in this.list) {
            if (!visited.get(u)) {
                const r = this.dfs(u);
                // update values
                r.visited.forEach((value, key) => {
                    visited.set(key, value);
                });
                r.labeledOrder.forEach((value, key) => {
                    labeledOrder.set(key, value);
                });
                finish.push(...r.finish);
            }
        }
        return { labeledOrder, finish };
    }
}
module.exports = Graph;
