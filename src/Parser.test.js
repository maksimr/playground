import { Parser } from './Parser';
import { Node } from './Node';
import { deepEqual, throws } from 'assert';

describe('Parser', function() {
  it('should correctly parse empty string', function() {
    deepEqual(Parser.parse(''), null);
  });

  it('should correctly parse Field expression', function() {
    deepEqual(Parser.parse('foo: bar'),
      Node.Field(
        Node.FieldName('foo'),
        Node.FieldValue('bar')
      )
    );
  });

  it('should correctly parse Not expression', function() {
    deepEqual(Parser.parse('not foo: bar'),
      Node.NOT(
        Node.Field(
          Node.FieldName('foo'),
          Node.FieldValue('bar')
        )
      )
    );
  });

  it('should correctly parse "or" expression', function() {
    deepEqual(Parser.parse('foo: bar or bar: foo'),
      Node.OR(
        Node.Field(Node.FieldName('foo'), Node.FieldValue('bar')),
        Node.Field(Node.FieldName('bar'), Node.FieldValue('foo'))
      )
    );
  });

  it('should correctly parse multiple "or" expressions ("or" is LEFT ASSOCIATIVE)', function() {
    deepEqual(Parser.parse('foo: bar or bar: foo or zoo: moo'),
      Node.OR(
        Node.OR(
          Node.Field(Node.FieldName('foo'), Node.FieldValue('bar')),
          Node.Field(Node.FieldName('bar'), Node.FieldValue('foo'))
        ),
        Node.Field(Node.FieldName('zoo'), Node.FieldValue('moo'))
      )
    );
  });

  it('should correctly parse "and" expression', function() {
    deepEqual(Parser.parse('foo: bar and bar: foo'),
      Node.AND(
        Node.Field(Node.FieldName('foo'), Node.FieldValue('bar')),
        Node.Field(Node.FieldName('bar'), Node.FieldValue('foo'))
      )
    );
  });

  it('should correctly parse multiple "and" expressions ("and" - is LEFT ASSOCIATIVE)', function() {
    deepEqual(Parser.parse('foo: bar and bar: foo and zoo: moo'),
      Node.AND(
        Node.AND(
          Node.Field(Node.FieldName('foo'), Node.FieldValue('bar')),
          Node.Field(Node.FieldName('bar'), Node.FieldValue('foo'))
        ),
        Node.Field(Node.FieldName('zoo'), Node.FieldValue('moo'))
      )
    );
  });

  it('should correctly parse empty Tuple expression', function() {
    deepEqual(Parser.parse('foo()'), Node.Tuple(Node.TupleName('foo'), []));
  });

  it('should correctly parse Tuple expression with one field', function() {
    deepEqual(Parser.parse('foo(bar: zoo)'), Node.Tuple(Node.TupleName('foo'), [
      Node.Field(Node.FieldName('bar'), Node.FieldValue('zoo'))
    ]));
  });

  it('should correctly parse Tuple expression with multiple fields', function() {
    deepEqual(Parser.parse('foo(bar: zoo moo: doo)'), Node.Tuple(Node.TupleName('foo'), [
      Node.Field(Node.FieldName('bar'), Node.FieldValue('zoo')),
      Node.Field(Node.FieldName('moo'), Node.FieldValue('doo'))
    ]));
  });

  describe('Error', function() {
    const UNEXPECTED_TOKEN = /Unexpected token/;

    it('should throw error if "Field" expression is incomplete', function() {
      throws(() => Parser.parse('foo: '), UNEXPECTED_TOKEN);
    });

    it('should throw error if "or" expression is incomplete', function() {
      throws(() => Parser.parse('foo: bar or'), UNEXPECTED_TOKEN);
    });

    it('should throw error if "and" expression is incomplete', function() {
      throws(() => Parser.parse('foo: bar and'), UNEXPECTED_TOKEN);
    });

    it('should throw error if query expression is invalid', function() {
      throws(() => Parser.parse('foo: bar foo'), UNEXPECTED_TOKEN);
    });
  });
});