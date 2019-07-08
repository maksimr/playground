import { Token } from './Token';
import { Cursor } from './Cursor';


export class Lexer {
  static parse(str) {
    const tokens = [];
    const cursor = new Cursor(str);
    while (cursor.hasNext()) {
      const char = cursor.next();
      switch (true) {
        case (' ' === char): break;
        case (':' === char): tokens.push(Token.COLON()); break;
        case ('(' === char): tokens.push(Token.LEFT_PAREN()); break;
        case (')' === char): tokens.push(Token.RIGHT_PAREN()); break;
        case ('{' === char): tokens.push(Token.LEFT_CBRACE()); break;
        case ('}' === char): tokens.push(Token.RIGHT_CBRACE()); break;
        case (/\w/.test(char)):
          let value = char;
          while (cursor.hasNext() && /\w/.test(cursor.peek())) value += cursor.next();
          switch (value) {
            case 'or': tokens.push(Token.OR()); break;
            case 'and': tokens.push(Token.AND()); break;
            case 'not': tokens.push(Token.NOT()); break;
            default: tokens.push(Token.WORD(value)); break;
          }
          break;
      }
    }

    return tokens;
  }
}


const assert = require('assert');
assert.deepEqual(Lexer.parse(''), []);
assert.deepEqual(Lexer.parse('   '), []);
assert.deepEqual(Lexer.parse(':'), [Token.COLON()]);
assert.deepEqual(Lexer.parse('('), [Token.LEFT_PAREN()]);
assert.deepEqual(Lexer.parse(')'), [Token.RIGHT_PAREN()]);
assert.deepEqual(Lexer.parse('{'), [Token.LEFT_CBRACE()]);
assert.deepEqual(Lexer.parse('}'), [Token.RIGHT_CBRACE()]);
assert.deepEqual(Lexer.parse('foo'), [Token.WORD('foo')]);
assert.deepEqual(Lexer.parse('or'), [Token.OR()]);
assert.deepEqual(Lexer.parse('and'), [Token.AND()]);
assert.deepEqual(Lexer.parse('not'), [Token.NOT()]);

assert.deepEqual(Lexer.parse('foo bar'), [
  Token.WORD('foo'),
  Token.WORD('bar')]);
assert.deepEqual(Lexer.parse('foo: bar'), [
  Token.WORD('foo'),
  Token.COLON(),
  Token.WORD('bar')]);
assert.deepEqual(Lexer.parse('foo: { bar zoo }'), [
  Token.WORD('foo'),
  Token.COLON(),
  Token.LEFT_CBRACE(),
  Token.WORD('bar'),
  Token.WORD('zoo'),
  Token.RIGHT_CBRACE()]);
assert.deepEqual(Lexer.parse('foo(bar: zoo)'), [
  Token.WORD('foo'),
  Token.LEFT_PAREN(),
  Token.WORD('bar'),
  Token.COLON(),
  Token.WORD('zoo'),
  Token.RIGHT_PAREN()]);