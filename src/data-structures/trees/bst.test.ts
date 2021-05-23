import binarySearchTree from "./bst";
import BSTNode from "./bst_node";
describe("Test for Binary Search Tree", () => {
  // TODO: test basic operations

  // TODO: use random arr
  test("BST in order between an interval", () => {
    const arr = [16, 2, 23, 5, 25, 8, 21, 29, 9, 11, 13, 20, 24];
    const nodes: BSTNode[] = [];
    const bst = new binarySearchTree();
    for (let val of arr) {
      const node = bst.insert(val);
      if (node) {
        nodes.push(node);
      }
    }
    const interval = bst.inOrderTreeWalkInterval(bst.root, arr[3], arr[0]);
    expect(interval).toEqual([5, 8, 9, 11, 13, 16]);
  });
});
