class Node{
    constructor(val){
        this.val= val;
        this.next = null;
    }
}

// Queue implementation, FIFO, through linked list
class Queue{
    constructor(){
        this.first = null;
        this.last = null;
        this.size = 0;
    }

    // add to the end and return the size of this queue
    enQueue(val){
        let node = new Node(val);
        if(this.size === 0 ){
            this.first = node;
            this.last = node;
        } else {
            this.last.next = node;
            this.last = node;
        }
        this.size++;
        return this.size;
    }

    // remove the first node and return it
    deQueue(){
        if(this.size === 0) return null
        let removed = this.first;
        if(this.size === 1){
            this.first = null;
            this.last = null;
        } else {
            this.first = removed.next;
            removed.next = null;
        }
        this.size--;
        return removed;
    }
}

// simple implementation using SLL, shift and unshift, here called as push and pop
// First in Last Out
class Stack {
    constructor(){
        this.first = null;
        this.last = null;
        this.size = 0;
    }

    // add a node at the beginning and return the size of this stack
    push(val){
        let node = new Node(val);
        if(this.size === 0){
            this.first = node;
            this.last = node;
        } else {
            node.next = this.first;
            this.first = node;
        }
        this.size++;
        return this.size;
    }
    // remove the first node and return it
    pop(){
        // empty stack 
        if(this.size === 0 ) return null;
        let removed = this.first;
        if(this.size === 1){
            this.first = null;
            this.last = null;
        } else {
            this.first = removed.next;
            removed.next = null;
        }  
        this.size--;
        return removed;
    }
}

class Graph {
    constructor(directed = false){
        this.list = {};
        this.directed = directed;
    };
    
    // adds a empty array to the new v
    addVertex(v){
        if(!this.list[v]) this.list[v] = [];
        return this;
    }

    // adds v to neighbour list of u ( and v to u neighbour list if it's a undirected graph )
    addEdge(u,v){
        this.list[u].push(v);
        if(!this.directed) this.list[v].push(u);
        return this;
    }
    
    // removes v from neighbour list of u (and v from u neighbour list if undirected)
    removeEdge(u,v){
        this.list[u] = this.list[u].filter(w => w !== v);
        if(!this.directed) this.list[v] = this.list[v].filter(w => w !== u);    
        return this;
    }

    // Removes all edges of v and v itself
    removeVertex(v){
        while(this.list[v].length){
            const u = this.list[v].pop();
            this.removeEdge(u,v);
        }
        delete this.list[v];
        return this;
    }

    // Recursive Depth First Search
    dfsr(s){
        let result = [];
        let visited = {};
        let list = this.list;
        (function dfs(v){
            if(!v) return;
            // mark v as visited
            visited[v] = true;
            result.push(v);
            // for every edge of v
            list[v].forEach(u => {
                // if v unvisited
                if(!visited[u]){
                    return dfs(u);
                }
            });
        })(s);
        return result;
    }

    // dfs iterative
    dfs(s){
        let result = [];
        let dist ={};
        let parents ={};
        let visited = {};
        let stack = new Stack();
        // add s tothe stack
        stack.push(s);
        // mark s as visited
        visited[s] = true;
        dist[s] = 0;
        let v;
        let i= 0 ;
        while(stack.size !==0){
            // take from the top of the stack
            v = stack.pop();
            result.push(v.val);
            // add parent of v wich is the last one poped
            if(i===0){
                parents[v.val] = null;    
            } else {
                parents[v.val] = result[i-1];
            }
            i++;
            // for every edge of v
            this.list[v.val].forEach(u => {
                // if v unvisited
                if(!visited[u]){
                    // mark u as visited 
                    visited[u] = true;
                    // add u to the stack
                    stack.push(u);
                    // calc dist 
                    dist[u] = dist[v.val] + 1;
                }
            })
        }
        return {result:result,parents:parents,dist:dist};
    }

    bfs(s){
        let result = [];
        let dist ={};
        let parents ={};
        let visited = {};
        let q = new Queue();
        // add s tothe stack
        q.enQueue(s);
        // mark s as visited
        visited[s] = true;
        dist[s] = 0;
        parents[s] = null;
        let v;
        while(q.size !== 0){
            v = q.deQueue();
            result.push(v.val);
            this.list[v.val].forEach(u => {
                // if u unvisited
                if(!visited[u]){
                    // mark u as visited
                    visited[u] = true;
                    // add u to the queue
                    q.enQueue(u);
                    parents[u] = v.val;
                    dist[u] = dist[v.val] + 1;
                }
            })
        }
        return {result:result,parents:parents,dist:dist,visited:visited};
    }

    // returns a list with all connected components of G 
    undirectConnectivity(){
        let components = [];
        let visited = {};
        let r, u;
        for(u in this.list) {
            // check if u node was already visited
            if(!visited[u]){
                r = this.bfs(u);
                // updtade visited nodes after this bfs
                visited = r.visited;
                // add this new component
                components.push(r.result);
            }
        };
        return components;
    }


}

// let g = new Graph();
// console.log(g.addVertex("Dallas"));
// console.log(g.addVertex("Tokyo"));
// console.log(g.addVertex("Aspen"));
// console.log(g.addEdge("Aspen","Tokyo"));
// console.log(g.addEdge("Aspen","Dallas"));
// console.log(g.addEdge("Tokyo","Dallas"));
// // console.log(g.removeEdge("Aspen","Tokyo"));
// console.log(g.removeVertex("Aspen"));

let g = new Graph();

g.addVertex("A");
g.addVertex("B");
g.addVertex("C");
g.addVertex("D");
g.addVertex("E");
g.addVertex("F");
g.addVertex("G");
g.addVertex("H");
g.addVertex("I");
g.addVertex("J");
g.addVertex("K");



g.addEdge("A","B");
g.addEdge("A","C");
g.addEdge("B","D");
g.addEdge("C","E");
g.addEdge("D","E");
g.addEdge("D","F");
g.addEdge("E","F");
g.addEdge("G","H");
g.addEdge("I","J");
g.addEdge("K","J");

// console.log(g.dfsr("A"));
// console.log(g.dfs("A"));
// console.log(g.bfs("A"));
console.log(g.undirectConnectivity());


//          A
//        /   \
//       B     C
//       |     |
//       D --- E
//        \   /
//          F
//       G --- H
//          I
//        /   \
//      J       K