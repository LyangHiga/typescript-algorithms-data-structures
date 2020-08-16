const fs = require('fs');
const Queue = require('./queue');
const Stack = require('./stack');
const MinHeap = require('./minHeap');

class Graph {
  constructor(directed = false) {
    this.list = {};
    this.directed = directed;
    this.currentLabel = null;
    this.size = 0;
    this.labeledOder = {};
  }

  // adds an empty array to the new v
  addVertex(v) {
    if (!this.list[v]) {
      this.list[v] = [];
      this.size++;
      return this;
    }
    // if v is already in this list do nothing
    return;
  }

  // adds v to neighbour list of u
  // ( and v to u neighbour list if it's a undirected graph )
  // O(1) - but dont check for duplications
  // DONT PASS DUPLICATES !
  addEdge(u, v, weight = 0) {
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
  }

  // Adds both u and v verteces and their edge w
  addVertecesAndEdge(u, v, w = 0) {
    this.addVertex(u);
    this.addVertex(v);
    this.addEdge(u, v, w);
  }

  // merge two verteces into a single one
  mergeVerteces(u, v) {
    // adds all neighbours of v to u
    // and removes from v
    while (this.list[v].length > 0) {
      const w = this.list[v].pop();
      // not allow self-loops
      if (w !== u) {
        this.list[u].push(w);
      }
    }
    // remove v from list
    this.removeVertex(v);
  }

  // removes v from neighbour list of u (and v from u neighbour list if undirected)
  removeEdge(u, v) {
    this.list[u] = this.list[u].filter((w) => w !== v);
    if (!this.directed) this.list[v] = this.list[v].filter((w) => w !== u);
    return this;
  }

  // Removes all edges of v and v itself
  removeVertex(v) {
    while (this.list[v].length) {
      const u = this.list[v].pop();
      this.removeEdge(u, v);
    }
    delete this.list[v];
    this.size--;
    return this;
  }

  // Returns true if v is a neighbour of u
  // otherwise returns false
  isNeighbour(u, v) {
    // if v is already in list[u] return true
    for (let neighbour in this.list[u]) {
      if (neighbour === v) return true;
    }
    return false;
  }

  //   file is the adj list of this Graph
  // FORMAT: <first vertex u>' '<second vertex v>' ' <edge w>
  create(file) {
    const data = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });
    let line = '';
    let split = [];
    for (let char in data) {
      if (data[char] !== '\n') {
        line += data[char];
      } else {
        split = line.trim().split(' ');
        this.addVertecesAndEdge(split[0], split[1], parseInt(split[2]));
        line = '';
      }
    }
    split = line.trim().split(' ');
    this.addVertecesAndEdge(split[0], split[1], parseInt(split[2]));
  }

  // file is the adj list of this Graph
  // FORMAT: <vertex u>' => neighbours: '<vertex v>' ... '<vertex n>'
  // this format allow duplicate edges, we need to handle
  createListAdj(file) {
    const data = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });
    let line = '';
    let split = [];
    for (let char in data) {
      if (data[char] !== '\n') {
        line += data[char];
      } else {
        split = line.trim().split(' ');
        const u = split[0];
        while (split.length > 1) {
          const v = split.pop();
          // to avoid duplicate edges
          if (!this.isNeighbour(u, v)) {
            // whether v is not neighbour of u
            this.addVertecesAndEdge(u, v);
          }
        }
        line = '';
      }
    }
    split = line.trim().split(' ');
    const u = split[0];
    while (split.length > 1) {
      const v = split.pop();
      if (!this.isNeighbour(u, v)) {
        this.addVertecesAndEdge(u, v);
      }
    }
  }

  // print this Graph
  //   FORMAT: <first vertex u> - <second vertex v> - <edge w>
  print() {
    for (let u in this.list) {
      for (let v in this.list[u]) {
        if (this.list[u][v].weight) {
          console.log(
            `${u} - ${this.list[u][v].node} - ${this.list[u][v].weight}`
          );
        } else {
          console.log(`${u} - ${this.list[u][v].node}`);
        }
      }
    }
  }

  // Recursive Depth First Search
  dfsr(s) {
    let result = [];
    let visited = {};
    let list = this.list;
    (function dfs(v) {
      if (!v) return;
      // mark v as visited
      visited[v] = true;
      result.push(v);
      // for every edge of v
      list[v].forEach((u) => {
        // if v unvisited
        if (!visited[u.node]) {
          return dfs(u.node);
        }
      });
    })(s);
    return result;
  }

  // dfs iterative
  dfs(s) {
    let result = [];
    let dist = {};
    let parents = {};
    let visited = {};
    let stack = new Stack();
    // add s tothe stack
    stack.push(s);
    // mark s as visited
    visited[s] = true;
    dist[s] = 0;
    let v;
    let i = 0;
    while (stack.size !== 0) {
      // take from the top of the stack
      v = stack.pop();
      result.push(v.val);
      // add parent of v wich is the last one poped
      if (i === 0) {
        parents[v.val] = null;
      } else {
        parents[v.val] = result[i - 1];
      }
      i++;
      // for every edge of v
      this.list[v.val].forEach((u) => {
        // if v unvisited
        if (!visited[u.node]) {
          // mark u as visited
          visited[u.node] = true;
          // add u to the stack
          stack.push(u.node);
          // calc dist
          dist[u.node] = dist[v.val] + 1;
        }
      });
      if (!this.labeledOder[v.val]) {
        this.labeledOder[v.val] = this.currentLabel;
        this.currentLabel++;
      }
    }
    return {
      result,
      parents,
      dist,
      labeledOder: this.labeledOder,
      visited,
    };
  }

  // returns the labeled order of each node this not work for cycled graphs, only DAGs
  topologicalSort() {
    let labeledOrder = {};
    let visited = {};
    // to keep track of ordering
    this.currentLabel = 0;
    let u, r;
    for (u in this.list) {
      if (!visited[u]) {
        r = this.dfs(u);
        // update values
        visited = r.visited;
        labeledOrder = r.labeledOder;
      }
    }
    return labeledOrder;
  }

  bfs(s) {
    let result = [];
    let dist = {};
    let parents = {};
    let visited = {};
    let q = new Queue();
    // add s tothe stack
    q.enQueue(s);
    // mark s as visited
    visited[s] = true;
    dist[s] = 0;
    parents[s] = null;
    let v;
    while (q.size !== 0) {
      v = q.deQueue();
      result.push(v.val);
      this.list[v.val].forEach((u) => {
        // if u unvisited
        if (!visited[u.node]) {
          // mark u as visited
          visited[u.node] = true;
          // add u to the queue
          q.enQueue(u.node);
          parents[u.node] = v.val;
          dist[u.node] = dist[v.val] + 1;
        }
      });
    }
    return { result, parents, dist, visited };
  }

  // returns a list with all connected components of G
  undirectConnectivity() {
    let components = [];
    let visited = {};
    let r, u;
    for (u in this.list) {
      // check if u node was already visited
      if (!visited[u]) {
        r = this.bfs(u);
        // updtade visited nodes after this bfs
        visited = r.visited;
        // add this new component
        components.push(r.result);
      }
    }
    return components;
  }

  //   returns the distance from s to each vertex and their parents
  dijkstra(s) {
    const heap = new MinHeap();
    // objs to map key to distance and key to parents
    const distances = {};
    const parents = {};
    let smallest;
    parents[s] = null;
    let deacrease = false;
    for (let vertex in this.list) {
      if (vertex !== s) {
        distances[vertex] = Infinity;
      }
    }
    distances[s] = 0;
    heap.enqueue(s, 0);
    // while we have nodes to visite:
    while (!heap.isEmpty()) {
      smallest = heap.dequeue().element.key;
      if (smallest || distances[smallest] !== Infinity) {
        for (let neighbour in this.list[smallest]) {
          let nextNode = this.list[smallest][neighbour];
          // calculate Dijkstra's  Greedy Criterium
          let d = distances[smallest] + nextNode.weight;
          //   compare distance calculated with last distance storaged
          if (d < distances[nextNode.node]) {
            //   updating distances and parents
            distances[nextNode.node] = d;
            parents[nextNode.node] = smallest;
            // try to deacrease key
            deacrease = heap.decreaseKey(nextNode.node, d);
            if (!deacrease) {
              // enqueue with new priority
              heap.enqueue(nextNode.node, d);
            }
          }
        }
      }
    }
    return { distances, parents };
  }

  // Returns the MST and its cost
  // isConnect === false means we dont know if it is
  //    if it is not: Returns the MST of the Connect Component that s belongs and its cost
  //    if it is: Returns the MST and its cost
  prim(s, isConnected = true) {
    const heap = new MinHeap();
    const mst = new Graph();
    // obj to keep track what element is already in mst
    const mstSet = {};
    // objs to map key to edge cost and to parent
    const edgeCost = {};
    const parents = {};
    // sum of each MST's edge
    let cost = 0;
    let dequeues = 0;
    let smallest;
    let deacrease = false;
    for (let vertex in this.list) {
      if (vertex !== s) {
        edgeCost[vertex] = Infinity;
        mstSet[vertex] = false;
      }
    }
    edgeCost[s] = 0;
    if (isConnected) heap.buildHeap(edgeCost);
    else heap.enqueue(s, 0);
    parents[s] = null;
    mstSet[s] = true;
    while (!heap.isEmpty()) {
      smallest = heap.dequeue().element.key;
      dequeues++;
      //   we found the min cost to add smallest in our MST
      cost += edgeCost[smallest];
      mst.addVertex(smallest);
      mstSet[smallest] = true;
      if (parents[smallest]) {
        //   if smallest has a parent (is not s node) add the edge to mst
        mst.addEdge(smallest, parents[smallest], edgeCost[smallest]);
      }
      if (smallest || edgeCost[smallest] !== Infinity) {
        for (let neighbour in this.list[smallest]) {
          let nextNode = this.list[smallest][neighbour];
          // compare the cost of this edge with the last one storaged
          //   and check if this node is already in mstSet
          if (
            nextNode.weight < edgeCost[nextNode.node] &&
            !mstSet[nextNode.node]
          ) {
            //   updating edgeCost and parents
            edgeCost[nextNode.node] = nextNode.weight;
            parents[nextNode.node] = smallest;
            // try to deacrease key, if isConnect always will decrease
            deacrease = heap.decreaseKey(nextNode.node, nextNode.weight);
            if (!deacrease) {
              // enqueue with new priority
              heap.enqueue(nextNode.node, nextNode.weight);
            }
          }
        }
      }
    }
    return { cost, mst };
  }
}

module.exports = Graph;
