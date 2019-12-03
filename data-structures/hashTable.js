class HashTable {
    constructor(size=53){
      this.keyMap = new Array(size);
    }
  
    _hash(key) {
      let total = 0;
      let WEIRD_PRIME = 31;
      for (let i = 0; i < Math.min(key.length, 100); i++) {
        let char = key[i];
        let value = char.charCodeAt(0) - 96
        total = (total * WEIRD_PRIME + value) % this.keyMap.length;
      }
      return total;
    }

    // add a new key, val
    set(key,val){
        // hash the index
        let i = this._hash(key);
        // separate chaining
        if(!this.keyMap[i]){
            this.keyMap[i] = [];
        }
        this.keyMap[i].push([key,val]);
    }
    // return val
    get(key){
        let i = this._hash(key);
        let j = 0;
        if(!this.keyMap[i]) return undefined;
        while(this.keyMap[i][j][0] !== key){
            j++;
        }
        return this.keyMap[i][j][1];
        
    }
    // return all unique values
    values(){
        let valArr = [];
        for(let i=0;i<this.keyMap.length;i++){
            if(this.keyMap[i]){
                for(let j =0; j< this.keyMap[i].length;j++){
                    if(!valArr.includes(this.keyMap[i][j][0])){
                        valArr.push(this.keyMap[i][j][1]);
                    }
                }
            }
        }
        return valArr;
    }

    // return all unique keys
    keys(){
        let keyArr = [];
        for(let i=0;i<this.keyMap.length;i++){
            if(this.keyMap[i]){
                for(let j =0; j< this.keyMap[i].length;j++){
                    if(!keyArr.includes(this.keyMap[i][j][0])){
                        keyArr.push(this.keyMap[i][j][0]);
                    }
                }
            }
        }
        return keyArr;
    }
}

let ht = new HashTable(17);
ht.set("maroon","#800000");
ht.set("yellow","#FFFF00");
ht.set("olive","#808000");
ht.set("salmon","#FA8072");
ht.set("lightcoral","#F08080");
ht.set("mediumvioletred","#C71585");
ht.set("plum","#DDA0DD");
console.log(ht.get("maroon"));
console.log(ht.get("yellow"));
console.log(ht.get("olive"));
console.log(ht.get("salmon"));
console.log(ht.get("lightcoral"));
console.log(ht.get("plum"));
console.log(ht.get("mediumvioletred"));

console.log(ht.keys());
console.log(ht.values());






