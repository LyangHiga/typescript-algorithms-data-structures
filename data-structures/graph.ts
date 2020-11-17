import Queue from "./basics/queue";
import Stack from "./basics/stack";
import Node from "./basics/node";
import MinHeap from "./heaps/minHeap";
import BHNode from "./heaps/bHNode";
// import FibonacciHeap from "./heaps/fibonacciHeap";
// import FHNode from "./heaps/fHNode";
import ListSet from "./disjoint-sets/listSet";
import ForestSet from "./disjoint-sets/forestSet";
import fs from "fs";

// Returns a random number between [min,max)
const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

interface Vertex {
  // Vertex Key MUST be string
  node: string;
  weight?: number;
}

const isWeighted = (v: Vertex) => {
  if (v.weight) return true;
  return false;
};

class Graph {
  // list adj: key (string) -> Vertex
  list: { [key: string]: Vertex[] };
  // to implement topologicalSort
  currentLabel: null | number;
  private size: number;
  constructor(public directed = false) {
    this.list = {};
    this.currentLabel = null;
    this.size = 0;
  }

  //   **********************************************************
  //                            HELPERS
  //   **********************************************************

  // print this Graph
  //   FORMAT: <first vertex u> - <second vertex v> - <edge w>
  print = () => {
    for (let u in this.list) {
      for (let v in this.list[u]) {
        if (!this.directed) {
          if (isWeighted(this.list[u][v])) {
            console.log(
              `${u} - ${this.list[u][v].node} - ${this.list[u][v].weight}`
            );
          } else {
            console.log(`${u} - ${this.list[u][v].node}`);
          }
        } else {
          if (isWeighted(this.list[u][v])) {
            console.log(
              `${u} -> ${this.list[u][v].node} - ${this.list[u][v].weight}`
            );
          } else {
            console.log(`${u} -> ${this.list[u][v].node}`);
          }
        }
      }
    }
  };

  // Returns true if this list constains this vertex (key v)
  // Otherwise returns false
  contains = (v: string) => {
    if (this.list[v] === undefined) return false;
    return true;
  };

  // Returns true if v is a neighbour of u
  // otherwise returns false
  isNeighbour = (u: string, v: string) => {
    // check if u is already in this list
    if (!this.contains(u)) return false;
    // if v is already in list[u] return true
    for (let i = 0; i < this.list[u].length; i++) {
      if (this.list[u][i].node === v) return true;
    }
    return false;
  };

  // Returns how many edges are between verteces u and v
  hme = (u: string | number, v: string | number) => {
    let c = 0;
    for (let i = 0; i < this.list[u].length; i++) {
      if (this.list[u][i].node === v) c++;
    }
    return c;
  };

  // Returns the number of edges of this graph
  countEdges = () => {
    let c = 0;
    for (let u in this.list) {
      for (let v in this.list[u]) {
        c++;
      }
    }
    return c / 2;
  };

  // Returns the key of two neighbours [u,v]
  pickRandomEdge = (): [string, string] => {
    const keys = Object.keys(this.list);
    const uIdx = random(0, keys.length);
    const u = keys[uIdx];
    const vIdx = random(0, this.list[u].length);
    const v = this.list[u][vIdx].node;
    return [u, v];
  };

  // Merge two verteces into a single one
  mergeVerteces = (u: string, v: string) => {
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
  reverse = () => {
    // if this is not a directed graph returns false
    if (!this.directed) return false;
    const g = new Graph(true);
    for (let u in this.list) {
      for (let v in this.list[u]) {
        if (isWeighted(this.list[u][v])) {
          g.addVertecesAndEdge(this.list[u][v].node, u, this.list[u][v].weight);
        } else {
          g.addVertecesAndEdge(this.list[u][v].node, u);
        }
      }
    }
    return g;
  };

  // returns a sort arr of edges {u: key of first vertex, v: key of second vertex, w: weight}
  //    Assumes Weighted Graph
  sortEdges = () => {
    const arr: { u: string; v: string; w: number }[] = [];
    for (let u in this.list) {
      for (let v in this.list[u]) {
        arr.push({
          u: u,
          v: this.list[u][v].node,
          w: this.list[u][v].weight!,
        });
      }
    }
    const sortArr = arr.sort((a, b) => a.w - b.w);
    return sortArr;
  };

  // Test if T.union(u,v) creates a cycle
  hasCycles = (T: ListSet | ForestSet, u: string, v: string) => {
    const uLeader = T.findSet(u);
    const vLeader = T.findSet(v);
    if (uLeader && vLeader && uLeader.key === vLeader.key) {
      return true;
    }
    return false;
  };

  //   **********************************************************
  //                            INSERT
  //   **********************************************************

  // Adds an empty array to the new vertice v
  // Returns this list
  // If v is already in this list do nothing
  addVertex = (v: string | number) => {
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
  addEdge = (u: string, v: string, weight = 0) => {
    // unweighted graph
    if (weight === 0) {
      this.list[u].push({ node: v });
      if (!this.directed) this.list[v].push({ node: u });
      return this;
    }
    // weighted graph
    this.list[u].push({ node: v, weight });
    if (!this.directed) this.list[v].push({ node: u, weight });
    return this;
  };

  // adds v to neighbour list of u
  // ( and v to u neighbour list if it's a undirected graph )
  // kepp the min cost edge for duplications
  addEdgeNoDuplicates = (u: string, v: string, weight: number) => {
    // avoid duplications
    for (let neighbour in this.list[u]) {
      const z = this.list[u][neighbour];
      // if already in list test to decrease with new edge
      if (v === z.node) {
        if (weight < z.weight!) {
          this.list[u][neighbour].weight = weight;
        }
        return this;
      }
    }
    this.list[u].push({ node: v, weight });
    return this;
  };

  // Adds both u and v verteces and their edge w
  addVertecesAndEdge = (u: string, v: string, w = 0, d = true) => {
    this.addVertex(u);
    this.addVertex(v);
    if (d) {
      this.addEdge(u, v, w);
    } else {
      this.addEdgeNoDuplicates(u, v, w);
    }
  };

  //   **********************************************************
  //                            DELETE
  //   **********************************************************

  // Removes v from neighbour list of u (and v from u neighbour list if undirected)
  // Returns this list
  removeEdge = (u: string, v: string) => {
    this.list[u] = this.list[u].filter((w: { node: string }) => w.node !== v);
    if (!this.directed) {
      this.list[v] = this.list[v].filter((w: { node: string }) => w.node !== u);
    }
    return this;
  };

  // Removes all edges of v and v itself
  //  Returns this list
  removeVertex = (v: string) => {
    while (this.list[v].length) {
      const u = this.list[v].pop()!;
      this.removeEdge(u.node, v);
    }
    delete this.list[v];
    this.size--;
    return this;
  };

  // If u does not have any neighbour, iow has degree zero
  // Removes u
  // Returns this graph
  // Returns false if u is not in this graph
  removeDegreeZero = (u: string) => {
    if (!this.contains(u)) return false;
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
  create = (file: string): false | void => {
    // check if this is a 'empty graph'
    if (this.size !== 0) return false;
    const data = fs.readFileSync(file, { encoding: "utf8", flag: "r" });
    let line = "";
    let split = [];

    for (let i = 0; i < data.length; i++) {
      if (data[i] !== "\n") {
        line += data[i];
      } else {
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
  createListAdj = (file: string): false | void => {
    // check if this is a 'empty graph'
    if (this.size !== 0) return false;
    const data = fs.readFileSync(file, { encoding: "utf8", flag: "r" });
    let line = "";
    let split = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== "\n") {
        line += data[i];
      } else {
        split = line.trim().split(" ");
        const u = split[0];
        while (split.length > 1) {
          const v = split.pop()!;
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
        const v = split.pop()!;
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
  createListAdjWeighted = (file: string): false | void => {
    // check if this is a 'empty graph'
    if (this.size !== 0) return false;
    const data = fs.readFileSync(file, { encoding: "utf8", flag: "r" });
    let line = "";
    let split = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== "\n") {
        line += data[i];
      } else {
        split = line.trim().split("	");
        const u = split[0];
        while (split.length > 1) {
          const t = split.pop()!;
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
        const t = split.pop()!;
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
  createDirected = (file: string, w = false): false | void => {
    // check if this is a 'empty graph'
    if (this.size !== 0) return false;
    // set this graph as directed
    this.directed = true;
    const data = fs.readFileSync(file, { encoding: "utf8", flag: "r" });
    let line = "";
    let split = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== "\n") {
        line += data[i];
      } else {
        split = line.trim().split(" ");
        if (!w) {
          this.addVertecesAndEdge(split[0], split[1]);
        } else {
          // Avoid duplications!
          this.addVertecesAndEdge(
            split[0],
            split[1],
            parseInt(split[2]),
            false
          );
        }

        line = "";
      }
    }
    // check if the last line is empty
    if (line !== "") {
      split = line.trim().split(" ");
      this.addVertecesAndEdge(split[0], split[1]);
    }
  };

  // TODO: direcyed weighted: u -> v cost

  //   **********************************************************
  //                            ALGORITHMS
  //   **********************************************************

  // Returns a min cut
  // We need to execute a sufficient number of times to have a high prob to find the min cut
  kargerMinCut = () => {
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
  bfs = (s: string) => {
    // the order of each vertex is dequeue (Array of Keys)
    const result: Array<string> = new Array();
    // Maps the key of each vertex to its distance from vertex s
    const dist: Map<string, number> = new Map();
    // Maps the key of each vertex to its parents key
    const parents: Map<string, null | string> = new Map();
    const visited: Map<string, boolean> = new Map();
    const q: Queue = new Queue();
    // add s to the queue
    q.enQueue(s);
    // mark s as visited
    visited.set(s, true);
    dist.set(s, 0);
    parents.set(s, null);
    let v: Node;
    while (q.size !== 0) {
      v = q.deQueue()!;
      result.push(v.key);
      this.list[v.key].forEach((u) => {
        // if u unvisited
        if (!visited.get(u.node)) {
          // mark u as visited
          visited.set(u.node, true);
          // add u to the queue
          q.enQueue(u.node);
          parents.set(u.node, v.key);
          dist.set(u.node, dist.get(v.key)! + 1);
        }
      });
    }
    return { result, parents, dist, visited };
  };

  // Returns a list with all connected components of G
  undirectConnectivity = () => {
    const components: Array<Array<string>> = new Array();
    const isVisited: Map<string, boolean> = new Map();
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
  dfs = (s: string) => {
    const result: Array<string> = new Array();
    const dist: Map<string, number> = new Map();
    const parents: Map<string, null | string> = new Map();
    const visited: Map<string, boolean> = new Map();
    // key to label order
    const labeledOrder: Map<string, number | null> = new Map();
    // finish order
    const finish: Array<string> = new Array();
    const stack = new Stack();
    // add s tothe stack
    stack.push(s);
    // mark s as visited
    visited.set(s, true);
    dist.set(s, 0);
    let v: Node;
    let i = 0;
    while (stack.size !== 0) {
      // take from the top of the stack
      v = stack.pop()!;
      result.push(v.key);
      // add parent of v wich is the last one poped
      if (i === 0) {
        parents.set(v.key, null);
      } else {
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
          dist.set(u.node, dist.get(v.key)! + 1);
        }
      });
      if (!labeledOrder.get(v.key)) {
        labeledOrder.set(v.key, this.currentLabel);
        this.currentLabel!++;
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

  // Returns the labeled order and finish order
  // Does not work for cycled graphs, only DAGs
  topologicalSort() {
    const labeledOrder: Map<string, number | null> = new Map();
    const visited: Map<string, boolean> = new Map();
    const finish: Array<string> = new Array();
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

  // Returns the size of each Strong Component
  // the id of each SC is its Leader
  kosaraju = () => {
    // reverse G
    const gRerv = this.reverse();
    // finish order
    if (gRerv === false) return false;
    const { finish } = gRerv.topologicalSort();
    const visited: Map<string, boolean> = new Map();
    // the vertex who calls dfs (maps leader's vertex key to the size of the Strong Component)
    const leader: Map<string, number> = new Map();
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

  // TODO: USE FIBONACCI HEAP (DECREASE KEY)
  // Returns the distance from s to each vertex and their parents
  dijkstra = (s: string) => {
    const heap = new MinHeap<string>();
    let dequeues = 0;
    // objs to map key to distance and key to parents
    const distances: Map<string, number> = new Map();
    const parents: Map<string, null | string> = new Map();
    let smallest: string;
    for (let vertex in this.list) {
      if (vertex !== s) {
        distances.set(vertex, Infinity);
      }
    }
    distances.set(s, 0);
    heap.enqueue(s, 0);
    // heap.buildHeap(distances)
    parents.set(s, null);
    let deacrease: boolean | number | BHNode<string> | undefined = false;
    // while we have nodes to visite:
    while (!heap.isEmpty()) {
      smallest = heap.dequeue()!.key;
      dequeues++;
      if (smallest || distances.get(smallest) !== Infinity) {
        for (let neighbour in this.list[smallest]) {
          let nextNode = this.list[smallest][neighbour];
          // calculate Dijkstra's  Greedy Criterium
          let d = distances.get(smallest)! + nextNode.weight!;
          //   compare distance calculated with last distance storaged
          if (d < distances.get(nextNode.node)!) {
            //   updating distances and parents
            distances.set(nextNode.node, d);
            parents.set(nextNode.node, smallest);
            // try to deacrease key
            deacrease = heap.decreaseKey(nextNode.node, d);
            // if this node is not in heap(wasn't decrease) add to the Heap
            if (deacrease === false) {
              heap.enqueue(nextNode.node, d);
            }
          }
        }
      }
    }
    console.log(
      `dequeues: ${dequeues},size: ${this.size}, h.size: ${heap.size}`
    );
    return { distances, parents };
  };

  // Returns the distance from s to each vertex and their parents O(mn)
  // negative costs are allowed
  // detect negative cycles: boolean output (cycle)
  // use parents (predecessor pointers) to traverse the cycle
  bellmanFord = (s: string) => {
    // O(m) space => to reconstruct path from s to (any) v
    // use parents map (predecessor pointers)
    const costs: Map<string, number> = new Map();
    // predecessor pointers
    const parents: Map<string, null | string> = new Map();
    // to stop earlier
    let stop = true;
    // for i =0, all dist from s to vertex are infinity
    for (let vertex in this.list) {
      if (vertex !== s) {
        costs.set(vertex, Infinity);
      }
    }
    // dist s to s
    costs.set(s, 0);
    parents.set(s, null);
    // i edges allowed, (n-1) at most => O(n)
    // try for n edges to check for negative cycles
    // if costs get smaller indefinitely (OPT(n,v) !== OPT(n-1,v))
    // There is a negative cycle
    for (let i = 1; i < this.size + 1; i++) {
      // if any distance get smaller, we can stop early
      // if after n-1 steps: the costs still get smaller (with n edges allowed)
      // negative cycle detected!
      stop = true;
      // try a min path for each edge => O(m)
      for (let v in this.list) {
        for (let neighbour in this.list[v]) {
          const w = this.list[v][neighbour];
          const d = costs.get(v)! + w.weight!;
          if (costs.get(w.node)! > d) {
            costs.set(w.node, d);
            parents.set(w.node, v);
            // still getting costs update => dont stop!
            stop = false;
          }
        }
      }
      if (stop) break;
    }
    return { costs, parents, cycle: !stop };
  };

  // Returns the distance from all pair of vertices (u,v) in V
  // negative costs are allowed
  // use parents (predecessor pointers) to traverse the cycle
  floydWarshall = () => {
    let costs = new Map();
    // predecessor pointers
    const parents = new Map();
    // Initialize maps
    // i: starter vertex, j: target vertex
    // K: set of allowed vertex, k: last vertex in K
    // K = {"0", "a", "1", ... k}
    // if i === j  costs[i][j][0] = 0
    // if i !== j costs[i][j][0] = Infinity
    // O(n2)
    for (let i in this.list) {
      for (let j in this.list) {
        if (!costs.get(i)) {
          costs.set(i, new Map());
          parents.set(i, new Map());
        }
        if (!costs.get(i).get(j)) {
          costs.get(i).set(j, new Map());
          parents.get(i).set(j, new Map());
        }
        if (!costs.get(i).get(j).get("0")) {
          costs.get(i).get(j).set("0", new Map());
        }
        if (i === j) {
          costs.get(i).get(j).set("0", 0);
          parents.get(i).set(i, null);
        } else {
          costs.get(i).get(j).set("0", Infinity);
        }
      }
    }
    // update neighbour distances
    // O(m)
    for (let i in this.list) {
      for (let neighbour in this.list[i]) {
        const w = this.list[i][neighbour];
        // costs.get(i).get(w.node).set(0, w.weight!);
        costs.get(i).get(w.node).set("0", w.weight!);
      }
    }
    let oldK = "0";
    // to expand K to the next vertex of this.list
    for (let k in this.list) {
      for (let i in this.list) {
        for (let j in this.list) {
          // to initialize a new map for this new set K
          if (!costs.get(i).get(j).get(k)) {
            costs.get(i).get(j).set(k, new Map());
          }
          // min {path without new k (as intermediary), path i to k + path k to j}
          const lastD = costs.get(i).get(j).get(oldK);
          const d =
            costs.get(i).get(k).get(oldK) + costs.get(k).get(j).get(oldK);
          if (d < lastD) {
            costs.get(i).get(j).set(k, d);
            parents.get(i).set(j, k);
          } else {
            costs.get(i).get(j).set(k, lastD);
          }
        }
      }
      // update oldK
      oldK = k;
    }
    return { costs, parents };
  };

  // TODO: Johnson's Algorithm?

  // TODO: USE FIBONACCI HEAP (DECREASE KEY)
  // Returns the MST and its cost
  prim = (s: string) => {
    const heap = new MinHeap<string>();
    const mst = new Graph();
    // map to keep track what element is already in mst
    // we dont need this in Dijkstra because dist always encrease
    const mstSet: Map<string, boolean> = new Map();
    const edgeCost: Map<string, number> = new Map();
    const parents: Map<string, null | string> = new Map();
    // sum of each MST's edge
    let cost = 0;
    let dequeues = 0;
    let smallest: string;
    let deacrease: boolean | BHNode<string> | number | undefined = false;
    for (let vertex in this.list) {
      if (vertex !== s) {
        edgeCost.set(vertex, Infinity);
        mstSet.set(vertex, false);
      }
    }
    // setting start node
    edgeCost.set(s, 0);
    heap.enqueue(s, 0);
    // heap.buildHeap(edgeCost);
    parents.set(s, null);
    mstSet.set(s, true);
    while (!heap.isEmpty()) {
      smallest = heap.dequeue()!.key;
      dequeues++;
      //   we found the min cost to add smallest in our MST
      cost += edgeCost.get(smallest)!;
      mst.addVertex(smallest);
      mstSet.set(smallest, true);
      if (parents.get(smallest)) {
        //   if smallest has a parent (is not the start node) add the edge to mst
        mst.addEdge(smallest, parents.get(smallest)!, edgeCost.get(smallest)!);
      }
      if (smallest || edgeCost.get(smallest) !== Infinity) {
        for (let neighbour in this.list[smallest]) {
          let nextNode = this.list[smallest][neighbour];
          // compare the cost of this edge with the last one storaged
          //   and check if this node is already in mstSet
          if (
            nextNode.weight! < edgeCost.get(nextNode.node)! &&
            !mstSet.get(nextNode.node)
          ) {
            //   updating edgeCost and parents
            edgeCost.set(nextNode.node, nextNode.weight!);
            parents.set(nextNode.node, smallest);
            // try to deacrease key
            deacrease = heap.decreaseKey(nextNode.node, nextNode.weight!);
            // if this node is not in heap(wasn't decrease) add to the Heap
            if (deacrease === false) {
              heap.enqueue(nextNode.node, nextNode.weight!);
            }
          }
        }
      }
    }
    console.log(
      `dequeues: ${dequeues},size: ${this.size}, h.size: ${heap.size}`
    );
    return { cost, mst };
  };

  // Returns the cost and MST
  // if k=== true
  //    Single-link Clustering
  //    return the cost of the very next edge which will not create a cycle.
  //    USE List Set => f=false
  kruskal = (f = true, k?: number) => {
    const sortEdges = this.sortEdges();
    const T = f ? new ForestSet() : new ListSet();
    for (let u in this.list) T.makeSet(u);
    const MST = new Graph();
    let cost = 0;
    for (let i = 0; i < sortEdges.length; i++) {
      let { u, v, w } = sortEdges[i];
      if (!this.hasCycles(T, u, v)) {
        T.union(u, v)!;
        MST.addVertecesAndEdge(u, v, w);
        cost += w;
        if (k) {
          if (T instanceof ListSet) {
            if (T.lists.size === k - 1) {
              return { w };
              break;
            }
          } else {
            console.log("Please use List Set. f = false");
            throw "use List Set. f=false";
          }
        }
      }
    }
    return { cost, MST };
  };
}

export = Graph;
