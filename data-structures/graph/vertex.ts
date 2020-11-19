export interface Vertex<T> {
  node: T;
  weight?: number;
}

export const isWeighted = <T>(v: Vertex<T>) => {
  if (v.weight) return true;
  return false;
};
