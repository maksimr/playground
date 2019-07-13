export class Token {
  static typeOf(token, type) {
    return token.type === type;
  }
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
  static COLON() { return new Token(Token.COLON); }
  static LEFT_PAREN() { return new Token(Token.LEFT_PAREN); }
  static RIGHT_PAREN() { return new Token(Token.RIGHT_PAREN); }
  static VALUE(value) { return new Token(Token.VALUE, value); }
  static OR() { return new Token(Token.OR); }
  static AND() { return new Token(Token.AND); }
  static NOT() { return new Token(Token.NOT); }
}