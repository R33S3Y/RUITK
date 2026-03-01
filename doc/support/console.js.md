`console.js` is a utility class getting info from the console

---

# Functions

### `Console.take()`

Takes control of the console and starts storing things sent to the console.
### `Console.free()`

Frees the console and puts things back to how they were,
And sets `Console.muted` to `false`

### `Console.clear()`

Resets / clears all data in the store

### `Console.dump()`

Dumps everything in the store to the console even if it is muted


# Vararibles
### `Console.store`

Where everything logged to the console get stored. 

Things in the store get split based on the type of logging . Eg: `Console.store.error`

### `Console.muted`

Enable / disables the actual logging to console. Defaults to `false`.
# Example
```js
Console.take();

console.log("A");
console.log("B");

console.log(Console.store.log[0]);
console.log(Console.store.log[1]);

Console.free();

// Logs the following to console
// "A"
// "B"
// "A"
// "B"
```