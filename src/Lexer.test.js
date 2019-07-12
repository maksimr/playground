import { Lexer } from './Lexer';
import { Token } from './Token';
import assert from 'assert';

describe('Lexer', function() {
  it('should correctly parse empty string', function() {
    assert.deepEqual(Lexer.parse(''), []);
  });

  it('should correctly parse string with spaces only', function() {
    assert.deepEqual(Lexer.parse('    '), []);
  });

  it('should correctly parse colon symbol', function() {
    assert.deepEqual(Lexer.parse(':'), [Token.COLON()]);
  });

  it('should correctly parse parens', function() {
    assert.deepEqual(Lexer.parse('('), [Token.LEFT_PAREN()]);
    assert.deepEqual(Lexer.parse(')'), [Token.RIGHT_PAREN()]);
  });

  it('should correctly parse reserved keywords', function() {
    assert.deepEqual(Lexer.parse('or'), [Token.OR()]);
    assert.deepEqual(Lexer.parse('and'), [Token.AND()]);
    assert.deepEqual(Lexer.parse('not'), [Token.NOT()]);
  });

  it('should correctly parse value', function() {
    assert.deepEqual(Lexer.parse('foo'), [Token.VALUE('foo')]);
  });

  it('should correctly parse value inside curly braces', function() {
    assert.deepEqual(Lexer.parse('{foo}'), [Token.VALUE('foo')]);
    assert.deepEqual(Lexer.parse('{foo bar}'), [Token.VALUE('foo bar')]);
  });

  it('should correctly parse query with field name and field value', function() {
    assert.deepEqual(Lexer.parse('foo: bar'), [
      Token.VALUE('foo'),
      Token.COLON(),
      Token.VALUE('bar')
    ]);
  });

  it('should throw error for unmatched curly brace', function() {
    assert.throws(() => Lexer.parse('{foo'), /Unterminated "{"/);
  });
});