class Node{
    constructor(val){
        this.val= val;
        this.next = null;
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
    constructor(){
        this.list = {};
    };
    
    // adds a empty array to the new v
    addVertex(v){
        if(!this.list[v]) this.list[v] = [];
        return this;
    }

    // adds v to neighbour list of u and v to u neighbour list
    addEdge(u,v){
        this.list[u].push(v);
        this.list[v].push(u);
        return this;
    }
    
    // removes v from neighbour list of u and v from u neighbour list
    removeEdge(u,v){
        this.list[u] = this.list[u].filter(w => w !== v);
        this.list[v] = this.list[v].filter(w => w !== u);
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

g.addVertex("A")
g.addVertex("B")
g.addVertex("C")
g.addVertex("D")
g.addVertex("E")
g.addVertex("F")


g.addEdge("A", "B")
g.addEdge("A", "C")
g.addEdge("B","D")
g.addEdge("C","E")
g.addEdge("D","E")
g.addEdge("D","F")
g.addEdge("E","F")
// console.log(g.dfsr("A"));
console.log(g.dfs("A"));


//          A
//        /   \
//       B     C
//       |     |
//       D --- E
//        \   /
//          F