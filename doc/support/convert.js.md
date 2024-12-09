`convert.js` is a simple lib for converting strings between different naming formats.

---

# Convert
### `Convert.convert(str, type)`

`str` is the string you want to convert. `type` is what you want it to convert into and accept the flowing inputs and what they convert it into

**Convert to normal words**
 - `"normalWords"`
 - `"normal words"`
 - `1`

**Convert to dashed case**
 - `"dashedCase"`
 - `"dashed-case"`
 - `2`

**Convert to snake case**
 - `"snakeCase"`
 - `"snake_case"`
 - `3`
**Convert to camel case**
 - `"camelCase"`
 - `4`

Example:
```js
let str = Convert.convert("transRights", "dashedCase")

console.log(str); // outputs: "trans-rights"
```