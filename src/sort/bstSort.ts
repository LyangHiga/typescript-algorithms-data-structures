interface BST {
  insert(val: number): any;
  inOrderTreeWalkStack(): number[];
}

// I can use any BST that implements this BST interface
const bstSort = (bst: BST, arr: number[]) => {
  // add numbers to bst
  for (let val of arr) {
    bst.insert(val);
  }
  const result = bst.inOrderTreeWalkStack();
  return result;
};

export default bstSort;
