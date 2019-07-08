export class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
  static COLON() { return new Token(Token.COLON); }
  static LEFT_PAREN() { return new Token(Token.LEFT_PAREN); }
  static RIGHT_PAREN() { return new Token(Token.RIGHT_PAREN); }
  static LEFT_CBRACE() { return new Token(Token.LEFT_CBRACE); }
  static RIGHT_CBRACE() { return new Token(Token.RIGHT_CBRACE); }
  static WORD(value) { return new Token(Token.WORD, value); }
  static OR() { return new Token(Token.OR); }
  static AND() { return new Token(Token.AND); }
  static NOT() { return new Token(Token.NOT); }
}