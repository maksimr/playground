import { Lexer } from './Lexer';
import { Token } from './Token';
import { deepEqual, throws } from 'assert';

describe('Lexer', function() {
  it('should correctly parse empty string', function() {
    deepEqual(Lexer.parse(''), []);
  });

  it('should correctly parse string with spaces only', function() {
    deepEqual(Lexer.parse('    '), []);
  });

  it('should correctly parse colon symbol', function() {
    deepEqual(Lexer.parse(':'), [Token.COLON()]);
  });

  it('should correctly parse parens', function() {
    deepEqual(Lexer.parse('('), [Token.LEFT_PAREN()]);
    deepEqual(Lexer.parse(')'), [Token.RIGHT_PAREN()]);
  });

  it('should correctly parse reserved keywords', function() {
    deepEqual(Lexer.parse('or'), [Token.OR()]);
    deepEqual(Lexer.parse('and'), [Token.AND()]);
    deepEqual(Lexer.parse('not'), [Token.NOT()]);
  });

  it('should correctly parse value', function() {
    deepEqual(Lexer.parse('foo'), [Token.VALUE('foo')]);
  });

  it('should correctly parse value inside curly braces', function() {
    deepEqual(Lexer.parse('{foo}'), [Token.VALUE('foo')]);
    deepEqual(Lexer.parse('{foo bar}'), [Token.VALUE('foo bar')]);
  });

  it('should correctly parse query with field name and field value', function() {
    deepEqual(Lexer.parse('foo: bar'), [
      Token.VALUE('foo'),
      Token.COLON(),
      Token.VALUE('bar')
    ]);
  });

  it('should throw error for unmatched curly brace', function() {
    throws(() => Lexer.parse('{foo'), /Unterminated "{"/);
  });
});