export class Node {
  static OR(leftExpressionNode, rightExpressionNode) {
    return new Node(Node.OR, [leftExpressionNode, rightExpressionNode]);
  }

  static AND(leftExpressionNode, rightExpressionNode) {
    return new Node(Node.AND, [leftExpressionNode, rightExpressionNode]);
  }

  static NOT(expressionNode) {
    return new Node(Node.NOT, expressionNode);
  }

  static Field(fieldNameNode, fieldValueNode) {
    return new Node(Node.Field, [fieldNameNode, fieldValueNode]);
  }

  static FieldName(name) {
    return new Node(Node.FieldName, name);
  }

  static FieldValue(value) {
    return new Node(Node.FieldValue, value);
  }

  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}