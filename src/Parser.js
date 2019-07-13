import { Token } from './Token';
import { Lexer } from './Lexer';
import { Cursor } from './Cursor';
import { Node } from './Node';

export class Parser {
  static Error(message = 'Unexpected token') {
    return Error(message);
  }

  static parse(query) {
    const tokens = Lexer.parse(query);
    const cursor = Cursor.from(tokens);

    return Query();

    function Query() {
      if (isAtEnd()) return null;
      const expr = OrExpression();
      if (!isAtEnd()) throw Parser.Error();
      return expr;
    }

    function OrExpression() {
      let expr = AndExpression();
      while (match(Token.OR)) expr = Node.OR(expr, AndExpression());
      return expr;
    }

    function AndExpression() {
      let expr = SignExpression();
      while (match(Token.AND)) expr = Node.AND(expr, SignExpression());
      return expr;
    }

    function SignExpression() {
      return (match(Token.NOT) ? Node.NOT(Item()) : Item());
    }

    function Item() {
      switch (true) {
        case (match(Token.VALUE)):
          const token = previous();
          switch (true) {
            case (match(Token.COLON)):
              if (match(Token.VALUE)) return (
                Node.Field(
                  Node.FieldName(token.value),
                  Node.FieldValue(previous().value)));

            case (match(Token.LEFT_PAREN)):
              const fields = [];
              while (match(Token.VALUE)) {
                const nameToken = previous();
                if (match(Token.COLON) && match(Token.VALUE)) {
                  const valueToken = previous();
                  fields.push(
                    Node.Field(
                      Node.FieldName(nameToken.value),
                      Node.FieldValue(valueToken.value)));
                  continue;
                }
                throw Parser.Error();
              }
              if (match(Token.RIGHT_PAREN))
                return Node.Tuple(Node.TupleName(token.value), fields);
          }
        default:
          throw Parser.Error();
      }
    }

    function isAtEnd() {
      return !cursor.hasNext();
    }

    function match(type) {
      if (check(type)) return (next(), true);
      return false;
    }

    function check(type) {
      if (isAtEnd()) return false;
      return Token.typeOf(peek(), type);
    }

    function previous() {
      return cursor.previous();
    }

    function next() {
      return cursor.next();
    }

    function peek() {
      return cursor.peek();
    }
  }
}