function main(): void {
  console.assert(binsearch(2, []) === -1);
  console.assert(binsearch(2, [2]) === 0);
  console.assert(binsearch(2, [1, 2]) === 1);

  function binsearch(it: number, arr: Array<number>): number {
    let max = arr.length;
    let min = 0;
    while (min < max) {
      const mid = Math.floor((max + min) / 2);
      if (arr[mid] === it) return mid;
      if (arr[mid] < it) min = mid + 1;
      if (arr[mid] > it) max = mid;
    }
    return -1;
  }
}


main();