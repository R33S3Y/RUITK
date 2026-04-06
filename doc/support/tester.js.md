`tester.js` is a utility class for validating input to a function. 

**Note:** this file relies heavly on [type.js](./type.js.md) and its type defentions. 

---

# Tester

### `Tester.test(template, actual, prefix = "", suffix = "", testTemplate = true)`

Finds and then logs and returns, issues about actual.  

| Value/Input  | Type                        | Decription                                                                                                                                                                         |
| ------------ | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `template`   | `array` \| `dict`           | is the object defining the required keys, their expected types, and additional constraints.                                                                                        |
| `actual`     | `array` \| `dict`           | is the object to validate against the `template`.                                                                                                                                  |
| `prefix`     | Optional `string`           | A string that will be added as a prefix to issues found with actual - for custom formating.                                                                                        |
| `suffix`     | Optional `string`           | A string that will be added as a suffix to issues found with actual - for custom forrmating.                                                                                       |
| testTemplate | Optional `booleanPrimitive` | By default Tester.test will run a good amount of tests on template. If for whatever reason you what Tester.test to not do this (Most likely preformance), You can set it to false. |
**Note:** that the prefix and suffix will not be added for issues where you used `Tester.test` wrong. As that is something you will need to fix. (not the user of your function)

**Returns:** 
`array` | `null` - Returns a array of all issues. if their are no issues it will return  `null`

**Template Format**: The `template` object should define  all expected values.  Each value in the template have the following options: 

| Option        | Type                                                                  | Decription                                                                                                                                                        |
| ------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`        | `array` \|  `stringprimative`                                         | the type/s of the value (all types in the array must be a  `stringprimative`) (See [Supported types - type.js](type.js.md#Supported%20types) for a list of types) |
| `full`        | `booleanPrimitive` \|  `undefined` (AKA Optional)                     | if  true or false, it will make sure that the thing has at least got a length of one. (This only works on `array`, `dict` and `string` types for now )            |
| `length`      | `number`  \|  `undefined` (AKA Optional)                              | if set to a number it will make sure that the thing is that length. (This  also only works on `array`, `dict` and `string` types for now )                        |
| `template`    | `array` \| `dict` \| `stringprimative` \|  `undefined` (AKA Optional) | A nested template to be apply to the nested objects in the value (Only works on `arrays` or `dicts`)                                                              |
| `templateAll` | `dict` \|  `stringprimative` \|  `undefined` (AKA Optional)           | The template to be apply to all nested objects in value (Only works on `arrays` or `dicts`)                                                                       |
| `templateIf`  | `dict` \|  `stringprimative` \|  `undefined` (AKA Optional)           | If the value is a certen type test the value apply these extra rules                                                                                              |



Example:
```js
let template = {
    name: { type: "string", full: true },
    age: "number",
    preferences: { type: ["array", "dict"], full: true },
};

let actual = {
    name: "Alex",
    age: 25,
    preferences: ["reading", "gaming"],
};

let result = Tester.test(template, actual);

console.log(result); // null (no issues)
```