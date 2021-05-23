import bstSort from "./bstSort";
import BST from "../data-structures/trees/bst";
import RBT from "../data-structures/trees/rbt";
import AVLTree from "../data-structures/trees/avl";

describe("BST Sort Test", () => {
  test("Testing if Vanilla BST sort a random array", () => {
    const nTimes = 100;
    const SIZE = 100;
    for (let i = 0; i < nTimes; i++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      const bst = new BST();
      const sortedArr = bstSort(bst, arr);
      const jsSortedArr = arr.slice().sort((a, b) => a - b);
      expect(sortedArr).toEqual(jsSortedArr);
    }
  });

  // FIXME: insertFixup
  //   test("Testing if Red Black Tree sort a random array", () => {
  //     const nTimes = 100;
  //     const SIZE = 25;
  //     for (let i = 0; i < nTimes; i++) {
  //       const arr = Array.from({ length: SIZE }, () =>
  //         Math.floor(Math.random() * 1000)
  //       );
  //       const rbt = new RBT();
  //       const sortedArr = bstSort(rbt, arr);
  //       console.log(sortedArr.length);
  //       console.log(sortedArr);
  //       const jsSortedArr = arr.slice().sort((a, b) => a - b);
  //       console.log(jsSortedArr.length);
  //       console.log(jsSortedArr);
  //       expect(sortedArr).toEqual(jsSortedArr);
  //     }
  //   });

  test("Testing if AVL Tree sort a random array", () => {
    const nTimes = 100;
    const SIZE = 100;
    for (let i = 0; i < nTimes; i++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      const avl = new AVLTree();
      const sortedArr = bstSort(avl, arr);
      const jsSortedArr = arr.slice().sort((a, b) => a - b);
      expect(sortedArr).toEqual(jsSortedArr);
    }
  });
});
