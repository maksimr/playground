import { Token } from './Token';
import { Cursor } from './Cursor';

export class Lexer {
  static Error(message) {
    return Error(message);
  }

  static parse(str) {
    const tokens = [];
    const cursor = Cursor.from(str);
    while (cursor.hasNext()) {
      const char = cursor.next();
      switch (true) {
        case (' ' === char): break;
        case (':' === char): tokens.push(Token.COLON()); break;
        case ('(' === char): tokens.push(Token.LEFT_PAREN()); break;
        case (')' === char): tokens.push(Token.RIGHT_PAREN()); break;
        case ('{' === char): {
          let value = '';
          while (cursor.hasNext() && cursor.peek() !== '}') value += cursor.next();
          if (!cursor.hasNext()) throw Lexer.Error('Unterminated "{"');
          cursor.next();
          tokens.push(Token.VALUE(value));
          break;
        }
        case (/\w/.test(char)): {
          let value = char;
          while (cursor.hasNext() && /\w/.test(cursor.peek())) value += cursor.next();
          switch (value) {
            case 'or': tokens.push(Token.OR()); break;
            case 'and': tokens.push(Token.AND()); break;
            case 'not': tokens.push(Token.NOT()); break;
            default: tokens.push(Token.VALUE(value)); break;
          }
          break;
        }
      }
    }

    return tokens;
  }
}