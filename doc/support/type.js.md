`type.js` is a small utility class made with the goal of avoiding simplifying and abstracting JS wack ass type system.
- - -

# Supported types
Here is a list of all supported types:
- "null"
	-  nullPrimitive 
-  "undefined"
	-  undefinedPrimitive
-  "bigInt"
	-  bigIntPrimitive
-  "symbol"
	-  symbolPrimitve
-  "string"
	-  stringPrimitive
	-  stringObject
-  "number"
	-  numberPrimitive
	-  numberObject
-  "boolean"
	-  booleanPrimitive
	-  booleanObject
-  "array"
	-  arrayObject
-  "map"
	-  mapObject
-  "set"
	-  setObject
-  "htmlelement"
	-  htmlElementObject
-  "dict"
	-  dictObject
-  "function" 
	-  functionObject

# Functions
## `Type.getType(value)`

Returns the value of a type. 

Inputs:
 - `value` - `*` - the type you want to get

Returns:
`stringPrimitive` - The type you have

Example: 
```js
let type = Type.isType("Value"); // "stringPrimative"
```

## `Type.isType(value, type)`

Tests if the value is the inputted type.

Inputs:
 - `value` - `*` - the type you want to test.
 - `type` - `stringPrimitive` - the type you want to test.

Returns:
`booleanPrimitive` - A true false test 

Example:
```js
Type.isType("Value", "stringPrimitive"); // True

Type.isType(new String("Value"), "stringObject"); // True

Type.isType("Value", "string"); // True
Type.isType(new String("Value"), "string"); // True
```

## `Type.squashType(value)`

Squashes the type of a thing to a primitive when available

Inputs:
 - `value` - `*` - The value to squash.

Returns:
`*` - The squashed value.

Example: 
```js
let value = new String("Value");

Type.isType(value, "stringObject"); // True
Type.isType(value, "stringPrimitive"); // False

value = Type.squashType(value);

Type.isType(value, "stringObject"); // False
Type.isType(value, "stringPrimitive"); // True
```