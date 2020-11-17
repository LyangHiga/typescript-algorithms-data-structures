import HuffmanNode from "./huffmanNode";
import MinHeap from "../../data-structures/heaps/minHeap";

const huffman = (arr: number[]) => {
  let heap = new MinHeap<string>();
  const p: Map<string, HuffmanNode> = new Map();
  for (let i = 0; i < arr.length; i++) {
    const z = new HuffmanNode(i.toString(), arr[i]);
    p.set(i.toString(), z);
    heap.enqueue(i.toString(), arr[i]);
  }
  let max = 0;
  let min = Infinity;
  for (let i = 0; i < arr.length - 1; i++) {
    const node = new HuffmanNode((i + arr.length).toString(), arr[i]);
    const x = heap.dequeue()!;
    node.left = p.get(x.key)!;
    const y = heap.dequeue()!;
    node.right = p.get(y.key)!;
    max = Math.max(node.left.height, node.right!.height);
    min = Math.min(node.left.min, node.right!.min);
    node.f = node.left.f + node.right!.f;
    node.height = max + 1;
    node.min = min + 1;
    p.set(node.key, node);
    heap.enqueue(node.key, node.f);
  }
  return p.get(heap.dequeue()!.key);
};

export = huffman;
