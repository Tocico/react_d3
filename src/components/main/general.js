export function getObjects(ids, list) {
  return ids.map(id => list[id]);
}

/*
* Merge two primitive arrays.
* Resulting array consists of unique elements from input arrays. 
*/
export function union(a, b) {
  a.push(...b.filter(e => !a.includes(e)));
}

export default {
  getObjects,
  union
};