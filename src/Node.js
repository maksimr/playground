export class Node {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
  static OR(xExpr, yExpr) { return new Node(Node.OR, [xExpr, yExpr]); }
  static AND(xExpr, yExpr) { return new Node(Node.AND, [xExpr, yExpr]); }
  static NOT(xExpr) { return new Node(Node.NOT, xExpr); }
  static Tuple(nameExpr, fieldList) { return new Node(Node.Tuple, [nameExpr, fieldList]); }
  static TupleName(name) { return new Node(Node.TupleName, name); }
  static Field(nameExpr, valueExpr) { return new Node(Node.Field, [nameExpr, valueExpr]); }
  static FieldName(name) { return new Node(Node.FieldName, name); }
  static FieldValue(value) { return new Node(Node.FieldValue, value); }
}