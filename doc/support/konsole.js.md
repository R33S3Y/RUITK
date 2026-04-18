`konsole.js` is a utility class getting info from the console

---

# Functions

### `Konsole.take()`

Takes control of the console and starts storing things sent to the console.

### `Konsole.free()`

Frees the console and puts things back to how they were,
And sets `Konsole.muted` to `false`

### `Konsole.clear()`

Resets / clears all data in the store

### `Konsole.dump()`

Dumps everything in the store to the console even if it is muted

# Variables

### `Konsole.store`

Where everything logged to the console get stored.

Things in the store get split based on the type of logging . Eg: `Konsole.store.error`

### `Konsole.muted`

Enable / disables the actual logging to console. Defaults to `false`.

# Example

```js
Konsole.take();

console.log("A");
console.log("B");

console.log(Konsole.store.log[0]);
console.log(Konsole.store.log[1]);

Konsole.free();

// Logs the following to console
// "A"
// "B"
// "A"
// "B"
```
