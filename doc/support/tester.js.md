`tester.js` is a utility class for validating object structures and types against a predefined template.

---

# Tester

### `Tester.dicts(template, actual, prefix = "", suffix = "")`

`template` is the object defining the required keys, their expected types, and additional constraints.  
`actual` is the object to validate against the `template`.  
`prefix` and `suffix` are optional strings that will be appended/prepended to error messages for custom formatting.

**Features**:

- Ensures all keys in the `template` exist in the `actual` object.
- Validates that values in the `actual` object match the types specified in the `template`.
- Supports additional constraints, such as:
    - `empty`: Whether a value is allowed to be empty (`true`/`false`).
    - `full`: Whether a value must be present (`true`/`false`).
- Returns `null` if the `actual` object is valid, or an object detailing any issues.
- Logs all errors found to console

**Template Format**: The `template` object should define expected keys with their types and constraints. Example:
```js
const template = {
	// key1 must be number
	key1: "number",
	// key 2 must be full str
    key2: { type: "string", empty: false }, 
    // key 3 must be full str or num
    key3: { type: ["number", "string"], full: true }, };
```


Supported Types:
 - "string"
 - "number"
 - "boolean"
 - "array"
 - "dict"
 - "map"
 - "set"
 - "HTMLElement"
 - "function"

Example:
```js
const template = {
    name: { type: "string", empty: false },
    age: "number",
    preferences: { type: ["array", "dict"], full: true },
};

const actual = {
    name: "Alex",
    age: 25,
    preferences: ["reading", "gaming"],
};

const result = Tester.dicts(template, actual);

console.log(result); // null (no issues)
```