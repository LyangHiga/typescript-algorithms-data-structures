class Graph {
    constructor(){
        this.list = {};
    };
    
    // adds a empty array to the new vertex
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
}

let g = new Graph();
console.log(g.addVertex("Dallas"));
console.log(g.addVertex("Tokyo"));
console.log(g.addVertex("Aspen"));
console.log(g.addEdge("Aspen","Tokyo"));
console.log(g.addEdge("Aspen","Dallas"));
console.log(g.addEdge("Tokyo","Dallas"));
// console.log(g.removeEdge("Aspen","Tokyo"));
console.log(g.removeVertex("Aspen"));



