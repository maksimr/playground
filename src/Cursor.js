export class Cursor {
  constructor(seq, startIndex = 0) {
    this.index = startIndex;
    this.size = seq.length;
    this.seq = seq;
  }
  next() { return this.seq[this.index++] }
  hasNext() { return this.index < this.size }
  peek() { return this.seq[this.index] }
}