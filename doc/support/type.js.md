`type.js` is a small utility class made with the goal of avoiding simplifying and abstracting JS wack ass type system.
- - -

# Supported types
Here is a list of all supported types and how to make them
- null
	-  nullPrimitive  - `let thing = null;`
-  undefined
	-  undefinedPrimitive - `let thing = undefined;`
- bigInt
	-  bigIntPrimitive - `let thing = Bigint("99999999999999999");`
- symbol
	-  symbolPrimitve - `let thing = Symbol();`
- string
	-  stringPrimitive - `let thing = "";`
	-  stringObject - `let thing = new string("");`
- number
	-  numberPrimitive - `let thing = 123;` or  `let thing = Number("123");`
	-  numberObject - `let thing = new Number("123");
- boolean
	-  booleanPrimitive - `let thing = true;` or  `let thing = Boolean(true);`
	-  booleanObject - `let thing = new Boolean(true);` (This is a really dumb object that you should like never use (See: [Boolean primitives and Boolean objects - MDM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean#boolean_primitives_and_boolean_objects) for the why))
- array
	-  arrayObject - `let thing = [];`
- map
	-  mapObject - `let thing = new Map();`
- set
	-  setObject - `let thing = new Set();`
-  htmlElement
	-  htmlElementObject - `let thing = new HTMLElement();`
- dict
	-  dictObject - `let thing = {};`
-  function 
	-  functionObject - `let thing = (a) => { return a };`

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

Squashes the type of a value from a object to a primitive when available

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


## `Type.squashRecursively(value)`

Searches an array or dict recursively and calling `Type.squashType` on everything.

Inputs:
 - `value` - `*` - The value to squash.

Returns:
`*` - The squashed value.

Example: 
```js
let value = [ new String("Value") ];

Type.isType(value[0], "stringObject"); // True
Type.isType(value[0], "stringPrimitive"); // False

value = Type.squashRecursively(value);

Type.isType(value[0], "stringObject"); // False
Type.isType(value[0], "stringPrimitive"); // True
```


# Variables
## `Type.supportedTypes`

A list of all supported types