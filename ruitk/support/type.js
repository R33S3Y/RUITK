export class Type {
  /**
   * List of all supported Types
   */
  static supportedTypes = [
    "null",
    "nullPrimitive",
    "undefined",
    "undefinedPrimitive",
    "bigInt",
    "bigIntPrimitive",
    "symbol",
    "symbolPrimitve",
    "string",
    "stringPrimitive",
    "stringObject",
    "number",
    "numberPrimitive",
    "numberObject",
    "boolean",
    "booleanPrimitive",
    "booleanObject",
    "array",
    "arrayObject",
    "map",
    "mapObject",
    "set",
    "setObject",
    "htmlElement",
    "htmlElementObject",
    "dict",
    "dictObject",
    "function",
    "functionObject",
  ];
  /**
   * Gets the type of the value of the type you want
   * @param {*} value the Value you want to find the type of
   * @returns {string} the type of the value
   */
  static getType(value) {
    if (value === null) {
      return "nullPrimitive";
    }
    switch (typeof value) {
      case "string":
        return "stringPrimitive";
      case "number":
        return "numberPrimitive";
      case "bigint":
        return "bigintPrimitive";
      case "boolean":
        return "booleanPrimitive";
      case "symbol":
        return "symbolPrimitive";
      case "undefined":
        return "undefinedPrimitive";
      case "object":
        switch (Object.prototype.toString.call(value).slice(8, -1)) {
          case "String":
            return "stringObject";
          case "Number":
            return "numberObject";
          case "Boolean":
            return "booleanObject";
          case "Array":
            return "arrayObject";
          case "Map":
            return "mapObject";
          case "Set":
            return "setObject";
          case "HTMLElement":
            return "htmlElementObject";
          case "Object":
            return "dictObject";
          default:
            return "unknownObject";
        }
      case "function":
        return "functionObject"; //why js
    }
  }
  /**
   * Tests if the value is a type.
   * @param {*} value The value to test.
   * @param {String} type The type to test against
   * @returns {boolean} If the value is the type.
   */
  static isType(value, type) {
    if (!Type.supportedTypes.includes(type)) {
      console.error(`Type.istype Function: Type: "${type}" is not supported`);
      return false;
    }
    if (Type.getType(value).includes(type)) {
      return true;
    }
    return false;
  }
  /**
   * Tests if the value is any type.
   * @param {*} value the value you want to find the types from
   * @param {Array} types a array of types to test against. If anyone passes then the whole function will pass
   * @returns {boolean}
   */
  static isTypes(value, types) {
    for (let type of types) {
      if (Type.isType(value, type) === true) return true;
    }
    return false;
  }
  /**
   * Squashes the type of a thing to a primitive when available (Eg: a stringObject becomes a stringPrimitive)
   * @param {*} value The value to squash
   * @returns {*} The squashed value
   */
  static squashType(value) {
    let type = Type.getType(value);

    let convertableTypes = ["stringObject", "numberObject", "booleanObject"];
    if (!convertableTypes.includes(type)) {
      return value;
    }
    return value.valueOf();
  }
  /**
   * Searches an array or dict recursively and calling `Type.squashType` on everything.
   * @param {*} value The value to squash
   * @returns {*} The squashed value
   */
  static squashRecursively(value) {

    value = Type.squashType(value);

    if (!Type.isType(value, ["array", "dict"])) {
      return value;
    }

    for (let i in value) {
      value[i] = Type.squashRecursively();
    }

    return value;
  }
}
