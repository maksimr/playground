export class Fields {
  static serialize(obj) {
    if (!obj) return '';
    if (Array.isArray(obj)) return Fields.serialize(obj[0]);
    return Object.keys(obj)
      .map((name) => {
        const fields = Fields.serialize(obj[name]);
        return fields ? name + `(${fields})` : name;
      })
      .join(',');
  }
}

export class Type {
  static any() { }
  static String() {}
  static Number() {}
  static Date() {}
  static Object(it) { return it; }
  static Array(it) { return it; }
}
