// the second string is an anagram of the 1st?
// input: two str
// out: boolean
function validAnagram(str1,str2){
    // they should be the same size
    if(str1.length !== str2.length){
        return false;
    }
    // create an object to each str
    let obj1 = {}, obj2 = {};
    // go through each str and counting how many time each chars appears
    for(let i=0; i<str2.length; i++){
        obj1[str1[i]] = (obj1[str1[i]] || 0 )+1;
        obj2[str2[i]] = (obj2[str2[i]] || 0 )+1;
    }
    for(let key in obj1){
        // check if this chr exists in obj2
        if(!(key in obj2)){
            return false;
        }
        if(obj1[key]!==obj2[key]){
            return false;
        }
    }
    return true;
}

console.log(validAnagram('', '')); // true
console.log( validAnagram('aaz', 'zza')); // false
console.log(validAnagram('anagram', 'nagaram')); // true
console.log(validAnagram("rat","car")); // false) // false
console.log(validAnagram('awesome', 'awesom')); // false
console.log(validAnagram('qwerty', 'qeywrt')); // true
console.log(validAnagram('texttwisttime', 'timetwisttext')); // true
