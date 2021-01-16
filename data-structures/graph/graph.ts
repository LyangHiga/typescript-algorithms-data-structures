import Queue from "../basics/queue";
import Stack from "../basics/stack";
import Node from "../basics/node";
import MinHeap from "../heaps/minHeap";
import BHNode from "../heaps/bHNode";
// import FibonacciHeap from "./heaps/fibonacciHeap";
// import FHNode from "./heaps/fHNode";
import ListSet from "../disjoint-sets/listSet";
import ForestSet from "../disjoint-sets/forestSet";
import fs from "fs";
import Vertex from "./vertex";

// Returns a random number between [min,max)
const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

class Graph<T> {
  // list adj: Map(key,array of vertex)
  list: Map<T, Vertex<T>[]>;
  // to implement topologicalSort
  currentLabel: null | number;
  size: number;
  constructor(public directed = false) {
    this.list = new Map();
    this.currentLabel = null;
    this.size = 0;
  }

  //   **********************************************************
  //                            HELPERS
  //   **********************************************************

  // print this Graph
  //   FORMAT: <first vertex u> - <second vertex v> - <edge w>
  print = () => {
    for (let [u, vertexList] of this.list) {
      for (let v of vertexList) {
        if (!this.directed) {
          console.log(`${u} - ${v.node} - ${v.weight}`);
        } else {
          console.log(`${u} -> ${v.node} - ${v.weight}`);
        }
      }
    }
  };

  // Returns true if this list constains this vertex (key v)
  // Otherwise returns false
  contains = (v: T) => {
    if (this.list.get(v) === undefined) return false;
    return true;
  };

  // Returns true if v is a neighbour of u
  // otherwise returns false
  isNeighbour = (u: T, v: T) => {
    // check if u is already in this list
    if (!this.contains(u)) return false;
    const vertexList = this.list.get(u)!;
    // if v is already in list[u] return true
    for (let i = 0; i < vertexList.length; i++) {
      if (vertexList[i].node === v) return true;
    }
    return false;
  };

  // Returns how many edges are between verteces u and v
  hme = (u: T, v: T) => {
    if (!this.contains(u)) return false;
    const vertexList = this.list.get(u)!;
    let c = 0;
    for (let i = 0; i < vertexList.length; i++) {
      if (vertexList[i].node === v) c++;
    }
    return c;
  };

  // Returns the number of edges of this graph
  countEdges = () => {
    let c = 0;
    for (let [u, vertexList] of this.list) {
      for (let v of vertexList) {
        c++;
      }
    }
    return c / 2;
  };

  // Returns the key of two neighbours [u,v]
  pickRandomEdge = () => {
    const keys = [...this.list.keys()];
    const uIdx = random(0, keys.length);
    const u = keys[uIdx];
    const vertexList = this.list.get(u)!;
    const vIdx = random(0, vertexList.length);
    const v = vertexList[vIdx].node;
    return [u, v];
  };

  // Merge two verteces into a single one
  mergeVerteces = (u: T, v: T) => {
    // adds all neighbours of v to u
    // and removes from v
    while (this.contains(v) && this.size > 2 && this.contains(u)) {
      const w = this.list.get(v)![0].node;
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
    const g = new Graph<T>(true);
    for (let [u, vertexList] of this.list) {
      for (let v in vertexList) {
        g.addVertecesAndEdge(vertexList[v].node, u, vertexList[v].weight);
      }
    }
    return g;
  };

  // returns a sort arr of edges {u: key of first vertex, v: key of second vertex, w: weight}
  //    Assumes Weighted Graph
  sortEdges = () => {
    const arr: { u: T; v: T; w: number }[] = [];
    for (let [u, vertexList] of this.list) {
      for (let v in vertexList) {
        arr.push({
          u: u,
          v: vertexList[v].node,
          w: vertexList[v].weight!,
        });
      }
    }
    const sortArr = arr.sort((a, b) => a.w - b.w);
    return sortArr;
  };

  // Test if T.union(u,v) creates a cycle
  hasCycles = (T: ListSet<T> | ForestSet<T>, u: T, v: T) => {
    const uLeader = T.findSet(u);
    const vLeader = T.findSet(v);
    if (uLeader && vLeader && uLeader.key === vLeader.key) {
      return true;
    }
    return false;
  };

  // For Ford-Fulkerson
  // Returns boolean for an existing augmenting path, and the path between s -> t
  augmentingPath = (s: T, t: T, g: Graph<T>) => {
    const { dist, parents } = g.bfs(s);
    const exists = dist.get(t) !== undefined ? true : false;
    if (!exists) return { exists: false, path: undefined };
    const path = this.getPath(s, t, parents);
    return { exists, path };
  };

  getPath = (s: T, t: T, parents: Map<T, T | null>) => {
    // go back from t until we reach s
    const path: Array<T> = [];
    let a = parents.get(t)!;
    path.push(t);
    while (a !== s) {
      path.push(a);
      a = parents.get(a)!;
    }
    path.push(s);
    return path.reverse();
  };

  // Returns the smallest capacity that remains in a path between s - t in a Net-Flow
  bottleneck = (path: Array<T>, g: Graph<T>) => {
    let min = Infinity;
    // for each edge(u,v) of this path check the capacity that remains
    for (let i = 0; i < path.length - 1; i++) {
      const u = path[i];
      const v = path[i + 1];
      const list = g.list.get(u)!;
      // search for v in adj list of u
      for (let node of list) {
        if (v === node.node) {
          // check if edge(u,v) < min
          if (min > node.weight) {
            min = node.weight;
          }
        }
      }
    }
    return min;
  };

  // Returns the initial Residual Graph (Gr)
  //  with original edges, and residual edges with zero capacity
  createResidualGraph = () => {
    const rg = new Graph<T>(true);
    for (let [u, vertexList] of this.list) {
      for (let v in vertexList) {
        // original edge = c(u,v)
        rg.addVertecesAndEdge(u, vertexList[v].node, vertexList[v].weight);
        // residual edges
        rg.addVertecesAndEdge(vertexList[v].node, u, 0);
      }
    }
    return rg;
  };

  // Update the edeges (orignal and residual) of Gr that are used in this path
  // using the bottleneck value
  updateResidualGraph = (g: Graph<T>, path: Array<T>, bottleneck: number) => {
    // for each edge of this path
    for (let i = 0; i < path.length - 1; i++) {
      // nodes u,v from the edge (u,v)
      const u = path[i];
      const v = path[i + 1];
      // ajd list (capacity of each edge that remains) of u and v
      const listU = g.list.get(u)!;
      const listV = g.list.get(v)!;
      // values that will be updated
      let updatedEdgeUV: Vertex<T>;
      let updatedEdgeVU: Vertex<T>;
      // serach for v in adj list of u
      for (let i = 0; i < listU.length; i++) {
        const t = listU[i];
        if (v == t.node) {
          // remove <bottleneck> from the remaining capacity of the edge (u,v)
          updatedEdgeUV = {
            node: t.node,
            weight: t.weight - bottleneck,
          };
          // updated adj list of u and set in Gr's map
          const updatedList = [...listU];
          updatedList[i] = updatedEdgeUV;
          g.list.set(u, updatedList);
          break;
        }
      }
      // search for u in the adj list of v
      for (let i = 0; i < listV.length; i++) {
        const t = listV[i];
        if (u == t.node) {
          // add <bottleneck> from the remaining capacity of the edge (v,u)
          // edges (u,v) and (v,u) are complementary, residual and original
          updatedEdgeVU = {
            node: t.node,
            weight: t.weight + bottleneck,
          };
          // update adj list of v and set to Gr's map
          const updatedList = [...listV];
          updatedList[i] = updatedEdgeVU;
          g.list.set(v, updatedList);
          break;
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
  addVertex = (v: T) => {
    if (!this.list.get(v)) {
      this.list.set(v, []);
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
  addEdge = (u: T, v: T, weight = 0) => {
    if (!this.contains(u) || !this.contains(v)) return false;
    let vertexList = this.list.get(u)!;
    vertexList.push({ node: v, weight });
    this.list.set(u, vertexList);
    if (!this.directed) {
      let vvl = this.list.get(v)!;
      vvl.push({ node: u, weight });
      this.list.set(v, vvl);
    }
    return this;
  };

  // adds v to neighbour list of u
  // ( and v to u neighbour list if it's a undirected graph )
  // kepp the min cost edge for duplications
  addEdgeNoDuplicates = (u: T, v: T, weight: number) => {
    if (!this.contains(u) || !this.contains(v)) return false;
    const vertexList = this.list.get(u)!;
    // avoid duplications
    for (let neighbour in vertexList) {
      const z = vertexList[neighbour];
      // if already in list test to decrease with new edge
      if (v === z.node) {
        if (weight < z.weight!) {
          vertexList[neighbour].weight = weight;
          this.list.set(u, vertexList);
        }
        return this;
      }
    }
    vertexList.push({ node: v, weight });
    this.list.set(u, vertexList);
    return this;
  };

  // Adds both u and v verteces and their edge w
  addVertecesAndEdge = (u: T, v: T, w = 0, d = true) => {
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
  removeEdge = (u: T, v: T) => {
    if (!this.contains(u) || !this.contains(v)) return false;
    let vertexList = this.list.get(u)!;
    vertexList = vertexList.filter((w: { node: T }) => w.node !== v);
    if (!this.directed) {
      // vertex list of v
      let vvl = this.list.get(v)!;
      vvl = vvl.filter((w: { node: T }) => w.node !== u);
      this.list.set(v, vvl);
    }
    this.list.set(u, vertexList);
    return this;
  };

  // Removes all edges of v and v itself
  //  Returns this list
  removeVertex = (v: T) => {
    if (!this.contains(v)) return false;
    const vertexList = this.list.get(v)!;
    while (vertexList.length) {
      const u = vertexList.pop()!;
      this.removeEdge(u.node, v);
    }
    this.list.delete(v);
    this.size--;
    return this;
  };

  // If u does not have any neighbour, iow has degree zero
  // Removes u
  // Returns this graph
  // Returns false if u is not in this graph
  removeDegreeZero = (u: T) => {
    if (!this.contains(u)) return false;
    const vertexList = this.list.get(u)!;
    if (vertexList.length === 0) {
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
  static create = (file: string) => {
    const g = new Graph<string>();
    const data = fs.readFileSync(file, { encoding: "utf8", flag: "r" });
    let line = "";
    let split = [];

    for (let i = 0; i < data.length; i++) {
      if (data[i] !== "\n") {
        line += data[i];
      } else {
        split = line.trim().split(" ");
        g.addVertecesAndEdge(split[0], split[1], parseInt(split[2]));
        line = "";
      }
    }
    // check if the last line is empty
    if (line !== "") {
      split = line.trim().split(" ");
      g.addVertecesAndEdge(split[0], split[1], parseInt(split[2]));
    }
    return g;
  };

  // Add all verteces and edges to this graph from a file
  // File is the adj list of this Graph
  // FORMAT: <vertex u>' => neighbours: '<vertex v>' ... '<vertex n>'
  // This format allow duplicate edges, we need to handle
  static createListAdj = (file: string) => {
    const g = new Graph<string>();
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
          if (!g.isNeighbour(u, v)) {
            // whether v is not neighbour of u
            g.addVertecesAndEdge(u, v);
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
        if (!g.isNeighbour(u, v)) {
          // whether v is not neighbour of u
          g.addVertecesAndEdge(u, v);
        }
      }
    }
    return g;
  };

  // Add all verteces and edges to this graph from a file
  // File is the adj list of this Graph
  // FORMAT: <vertex u>' => neighbours: '<vertex v>,weight' ... '<vertex n>,weight'
  // This format allow duplicate edges, we need to handle
  static createListAdjWeighted = (file: string) => {
    const g = new Graph<string>();
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
          if (!g.isNeighbour(u, v[0])) {
            // whether v is not neighbour of u
            g.addVertecesAndEdge(u, v[0], parseInt(v[1]));
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
        if (!g.isNeighbour(u, v[0])) {
          // whether v is not neighbour of u
          g.addVertecesAndEdge(u, v[0], parseInt(v[1]));
        }
      }
    }
    return g;
  };

  // Add all verteces and edges to this graph from a file
  // File is the adj list of this Graph
  // FORMAT: <first vertex u>' '<second vertex v>
  // it is a drirected graph, the edge goes from u to v, i.e.: u -> v
  // d to allow duplication
  static createDirected = (file: string, w = false, d = false) => {
    // set this graph as directed
    const g = new Graph<string>(true);
    const data = fs.readFileSync(file, { encoding: "utf8", flag: "r" });
    let line = "";
    let split = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== "\n") {
        line += data[i];
      } else {
        split = line.trim().split(" ");
        if (!w) {
          g.addVertecesAndEdge(split[0], split[1], 0, d);
        } else {
          // Avoid duplications!
          g.addVertecesAndEdge(split[0], split[1], parseInt(split[2]), d);
        }

        line = "";
      }
    }
    // check if the last line is empty
    if (line !== "") {
      split = line.trim().split(" ");
      g.addVertecesAndEdge(split[0], split[1]);
    }
    return g;
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
  bfs = (s: T) => {
    // the order of each vertex is dequeue (Array of Keys)
    const result: T[] = new Array();
    // Maps the key of each vertex to its distance from vertex s
    const dist: Map<T, number> = new Map();
    // Maps the key of each vertex to its parents key
    const parents: Map<T, null | T> = new Map();
    const visited: Map<T, boolean> = new Map();
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
      this.list.get(v.key)!.forEach((u) => {
        // if u unvisited
        if (!visited.get(u.node) && u.weight > 0) {
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
    const components: Array<Array<T>> = new Array();
    const isVisited: Map<T, boolean> = new Map();
    // a single component after to execute one bfs
    for (let [u] of this.list) {
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
  dfs = (s: T) => {
    const result: Array<T> = new Array();
    const dist: Map<T, number> = new Map();
    const parents: Map<T, null | T> = new Map();
    const visited: Map<T, boolean> = new Map();
    // key to label order
    const labeledOrder: Map<T, number | null> = new Map();
    // finish order
    const finish: Array<T> = new Array();
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
      this.list.get(v.key)!.forEach((u) => {
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
    const labeledOrder: Map<T, number | null> = new Map();
    const visited: Map<T, boolean> = new Map();
    const finish: Array<T> = new Array();
    // to keep track of ordering
    this.currentLabel = 0;
    let r;
    for (let [u] of this.list) {
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
    const visited: Map<T, boolean> = new Map();
    // the vertex who calls dfs (maps leader's vertex key to the size of the Strong Component)
    const leader: Map<T, number> = new Map();
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
  dijkstra = (s: T) => {
    const heap = new MinHeap<T>();
    let dequeues = 0;
    // objs to map key to distance and key to parents
    const distances: Map<T, number> = new Map();
    const parents: Map<T, null | T> = new Map();
    let smallest: T;
    for (let [vertex] of this.list) {
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
        const vertexList = this.list.get(smallest)!;
        for (let neighbour in vertexList) {
          let nextNode = vertexList[neighbour];
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
    // console.log(
    //   `dequeues: ${dequeues},size: ${this.size}, h.size: ${heap.size}`
    // );
    return { distances, parents };
  };

  // Returns the distance from s to each vertex and their parents O(mn)
  // negative costs are allowed
  // SSSP (Single Source Shortest Problemß)
  // detect negative cycles: boolean output (cycle)
  // use parents (predecessor pointers) to traverse the cycle
  bellmanFord = (s: T) => {
    // O(m) space => to reconstruct path from s to (any) v
    // use parents map (predecessor pointers)
    const costs: Map<T, number> = new Map();
    // predecessor pointers
    const parents: Map<T, null | T> = new Map();
    // to stop earlier
    let stop = true;
    // i: number of edges allowed
    // for i =0, all dist from s to vertex are infinity
    for (let [vertex] of this.list) {
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
      for (let [v, vertexList] of this.list) {
        for (let neighbour in vertexList) {
          const w = vertexList[neighbour];
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
  // APSP (All Pairs Shortest Path)
  // use parents (predecessor pointers) to traverse the cycle
  // Also returns the last node used in set K
  floydWarshall = () => {
    let costs = new Map<T, Map<T, Map<T, number>>>();
    // predecessor pointers
    const parents = new Map<T, Map<T, T | null>>();
    const keys = [...this.list.keys()];
    // last vertex in K
    let oldK = keys[0];
    // Initialize maps
    // i: starter vertex, j: target vertex
    // K: set of allowed vertex, k: last vertex in K
    // K = {"0", "a", "1", ... k}
    // if i === j  costs[i][j][0] = 0
    // if i !== j costs[i][j][0] = Infinity
    // O(n2)
    for (let [i] of this.list) {
      for (let [j] of this.list) {
        if (!costs.get(i)) {
          costs.set(i, new Map<T, Map<T, number>>());
          parents.set(i, new Map<T, T | null>());
        }
        if (!costs.get(i)!.get(j)) {
          costs.get(i)!.set(j, new Map<T, number>());
        }
        if (i === j) {
          costs.get(i)!.get(j)!.set(oldK, 0);
          parents.get(i)!.set(i, null);
        } else {
          costs.get(i)!.get(j)!.set(oldK, Infinity);
        }
      }
    }
    // update neighbour distances
    // O(m)
    for (let [i, vertexList] of this.list) {
      for (let neighbour in vertexList) {
        const w = vertexList[neighbour];
        costs.get(i)!.get(w.node)!.set(oldK, w.weight!);
      }
    }
    // to expand K to the next vertex of this.list
    //  O(n3)
    for (let k of keys) {
      for (let [i] of this.list) {
        for (let [j] of this.list) {
          // min {path without new k (as intermediary), path i to k + path k to j}
          const lastD = costs.get(i)!.get(j)!.get(oldK)!;
          const d =
            costs.get(i)!.get(k)!.get(oldK)! + costs.get(k)!.get(j)!.get(oldK)!;
          if (d < lastD) {
            costs.get(i)!.get(j)!.set(k, d);
            parents.get(i)!.set(j, k);
          } else {
            costs.get(i)!.get(j)!.set(k, lastD);
          }
        }
      }
      // update oldK
      oldK = k;
    }
    return { costs, parents, oldK };
  };

  // Returns the distance from all pair of vertices (u,v) in V
  // negative costs are allowed
  // Report a negative Cycle (cycle: true)
  // APSP (All Pairs Shortest Path)
  // use parents (predecessor pointers) to traverse the cycle
  //  O(mnlog(n))
  johnson = (s: T) => {
    // map distance between vertex u to v
    const dist = new Map<T, Map<T, number>>();
    // map parent of v when u is the start vertex
    const par = new Map<T, Map<T, T | null>>();

    // Form G': equal to G, only add vertex <s>
    const newG = new Graph<T>(true);
    // O(m)
    for (let [u, vertexList] of this.list) {
      for (let v of vertexList) {
        newG.addVertecesAndEdge(u, v.node, v.weight);
      }
    }
    // Add a new vertex <s> connect to all v in G, with edge cost = 0
    // O(n)
    newG.addVertex(s);
    for (let [v] of this.list) {
      if (s !== v) newG.addEdge(s, v, 0);
    }

    // runs BF in G' using <s> as start vertex
    // BF: O(mn)
    const { costs, cycle } = newG.bellmanFord(s);
    // check for a negative cycle
    if (cycle) return { cycle: true };

    // calcule ce' = ce + pu - pv
    // pu and pv are the costs from BF for a pair (u,v) of vertex
    // O(m)
    for (let [u, vertexList] of this.list) {
      for (let v of vertexList) {
        const newCost = v.weight + costs.get(u)! - costs.get(v.node)!;
        v.weight = newCost;
        this.list.set(u, vertexList);
      }
    }

    // run dijkstra for each vertex (using ce')
    // ce' is not negative, but dijkstra will retun: d'(u,v)
    // d'(u,v) = d(u,v) + pu - pv
    // Dijkstra n times: O(nmlog(n))
    for (let [u] of this.list) {
      const { distances, parents } = this.dijkstra(u);
      dist.set(u, distances);
      par.set(u, parents);
    }

    // we nedd to calculate d(u,v)
    // d(u,v) = d'(u,v) - pu + pv
    // O(n2)
    for (let [u] of this.list) {
      for (let [v] of this.list) {
        if (u !== v) {
          const d = dist.get(u)!.get(v)!;
          const pu = costs.get(u)!;
          const pv = costs.get(v)!;
          dist.get(u)!.set(v, d - pu + pv);
        }
      }
    }
    return { costs: dist, parents: par, cycle };
  };

  // TODO: USE FIBONACCI HEAP (DECREASE KEY)
  // Returns the MST and its cost
  prim = (s: T) => {
    const heap = new MinHeap<T>();
    const mst = new Graph<T>();
    // map to keep track what element is already in mst
    // we dont need this in Dijkstra because dist always encrease
    const mstSet: Map<T, boolean> = new Map();
    const edgeCost: Map<T, number> = new Map();
    const parents: Map<T, null | T> = new Map();
    // sum of each MST's edge
    let cost = 0;
    let dequeues = 0;
    let smallest: T;
    let deacrease: boolean | BHNode<T> | number | undefined = false;
    for (let [vertex] of this.list) {
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
        const vertexList = this.list.get(smallest)!;
        for (let neighbour in vertexList) {
          let nextNode = vertexList[neighbour];
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
    const T = f ? new ForestSet<T>() : new ListSet<T>();
    for (let [u] of this.list) T.makeSet(u);
    const MST = new Graph<T>();
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

  // Returns the final Residual Graph
  fordFulkerson = (s: T, t: T) => {
    // Net flow must be a directed graph
    if (!this.directed) return false;
    const flow = new Map<T, Map<T, number>>();
    // Initially f(e)=0
    // for each edge(u,v) of G f(e) = 0
    for (let [u, vertexList] of this.list) {
      flow.set(u, new Map<T, number>());
      for (let v of vertexList) {
        flow.get(u)!.set(v.node, 0);
      }
    }
    let residualGraph: Graph<T> = this.createResidualGraph();
    let { exists, path } = this.augmentingPath(s, t, residualGraph);
    // if there is no path between s - t return false
    if (!exists || !path) return false;
    // min val of flow that still can pass through
    const bottleneck = this.bottleneck(path, residualGraph);
    // while exists a path do augmenting path in Gr
    while (exists) {
      const bottleneck = this.bottleneck(path!, residualGraph);
      residualGraph = this.updateResidualGraph(
        residualGraph,
        path!,
        bottleneck
      );
      const ap = this.augmentingPath(s, t, residualGraph);
      exists = ap.exists;
      path = ap.path;
    }
    return residualGraph;
  };
}

export = Graph;
