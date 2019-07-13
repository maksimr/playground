import { Parser } from './Parser';
import { Node } from './Node';
import { deepEqual } from 'assert';

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
});