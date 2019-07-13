export class Cursor {
  static from(seq) {
    return new Cursor(seq);
  }

  constructor(seq, startIndex = 0) {
    this.index = startIndex;
    this.size = seq.length;
    this.seq = seq;
  }

  next() { return this.seq[this.index++]; }
  previous() { return this.seq[this.index - 1]; }
  hasNext() { return this.index < this.size; }
  peek() { return this.seq[this.index]; }
}