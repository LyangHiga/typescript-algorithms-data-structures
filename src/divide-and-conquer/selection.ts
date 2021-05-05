// Returns a random number between [min,max)
const random = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };
  
  // Returns a new list if each group of 5 inside of l[i]
  // eg:
  // arr := [0,1,2,3,4,5,6,7,8,9]:
  // l:= [[0,1,2,3,4],[5,6,7,8,9]]
  const groupOf5 = (arr:number[]) => {
    let l = [];
    let g = [];
    for (let i = 0; i < arr.length; i++) {
      if (g.length < 5) g.push(arr[i]);
      else {
        l.push(g);
        g = [];
        g.push(arr[i]);
      }
    }
    l.push(g);
    return l;
  };
  
  // Returns the median of a list with 5 values or less
  const medianOf5 = (arr:number[]) => {
    if (arr.length > 5) throw new Error('Arr cannot have more than 5 numbers');
    arr.sort(function (a, b) {
      return a - b;
    });
    const m = Math.floor(arr.length / 2);
    return arr[m];
  };
  
  // Returns 'the median of the medians'
  const medianOfMedians = (arr: number[]) => {
    // break arr into arr.length/5 of sie 5 each
    const l = groupOf5(arr);
    // array with arr.length/5 medians
    const c = [];
    for (let i = 0; i < l.length; i++) {
      c.push(medianOf5(l[i]));
    }
    //middle of c
    let mc = Math.floor(c.length / 2);
    //recursively compute median of c
    const p = selection(c, mc, 1);
    return p;
  };
  
  // Returns a pivot
  // chooseP:
  //      0: Random Pivot
  //      1: Deterministic Pivot ('median of medians')
  const choosePivot = (arr:number[], chooseP:number) => {
    switch (chooseP) {
      case 0:
      default:
        const idx = random(0, arr.length);
        [arr[0], arr[idx]] = [arr[idx], arr[0]];
        return arr[0];
      case 1:
        return medianOfMedians(arr);
    }
  };
  
  // Returns: the order statistic of a given pivot (its correct position if the arr was ordered)
  // also make a partition around the pivot
  // chooseP:
  //      0: Randomized Selection
  //      1: Deterministic Selection
  const partition = (arr: number[], chooseP = 0) => {
    const p = choosePivot(arr, chooseP);
    // keep track of how many elements are smaller than the pivot
    // this will be its 'right' position if arr is sorted
    let i = 1;
    // elements with idx < j : partitioned
    // elements with idx > j unpartitioned
    for (let j = 1; j < arr.length; j++) {
      // check if the next element is smaller than the pivot
      if (arr[j] < p) {
        // swap and move i
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i++;
      }
    }
    // swap p to its right position and returns its idx
    [arr[0], arr[i - 1]] = [arr[i - 1], arr[0]];
    return i - 1;
  };
  
  // Returns the ith smallest element of arr
  const selection = (arr: number[], i: number, chooseP = 0):number|boolean => {
    // out of bounds
    if (i > arr.length - 1) return false;
    if (arr.length === 1) return arr[0];
    // j is the index of p
    const j = partition(arr, chooseP);
    if (j === i) return arr[j];
    if (j > i) {
      const left = arr.slice(0, j);
      return selection(left, i);
    }
    // i < j
    const right = arr.slice(j + 1);
    return selection(right, i - j - 1);
  };
  
  export = selection
  