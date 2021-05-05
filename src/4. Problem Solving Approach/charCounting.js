function charCounting(str){
    var obj ={}

    // go through the alphanumerical chars of the str 
    for(let chr of str){
        if(isAlphanumeric(chr)){
        // check if this char is already in the obj add one otherwise add this key in the obj 
            chr = chr.toLowerCase()
            obj[chr] = obj[chr]+1 || 1;
        }
    }
    return obj;
};

function isAlphanumeric(chr){
// we could also use regEx
    var code = chr.charCodeAt(0);
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false;
    }
    return true;
}

console.log(charCounting("aaaaa bb"));