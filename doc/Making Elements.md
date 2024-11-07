Elements are simply dicts with predefined key that are needed for various functions
Here is a list of all the keys:
### Required Keys
 - `name` - a string used as a unique ID.
 - `function` - a function meant to return a HTML element or a array of HTML elements it is given 2 inputs `info` & `element`.
 - `style` - a dict of styles that is applied to the all elements returned but not their children. The style Syntax is defined by [style.js](support/style.js.md) and there style function. Look there for up to date info.
### Optional Keys
 - `handleStyle` - Defaults to false - If you add `handleStyle : true` to your elements definition you are now responsible for applying your elements styles. Eg:
```js
import { Style } from "../../support/style.js";

let elements = [{ // tile
	name : "tile",
	function : (info, element) => {
		let tile = document.createElement("div");
		Style.style(tile, element.style);
		return tile;
	},
	style : {
		// styles
	},
	handleStyle : true,
}];
```
 - `ParseLevel` - Defaults to 2 - This value changes how much prepossessing the info object is going through. By default this value is set to 2 meaning that is fully processed with all the child elements sorted and things like that, 0 means it's a string so have fun with that and 1 means that the first level of dicts and arrays are processed but nothing more. this means that all contents of the first array are stringifyed. Here some examples:
```js
// parseLevel 0
info = {
	'{"config" : {"tileRowType" : ["scroll", "scroll", "fixed"]}, "content" : \n <h1>{"content" : "h1 h1 h1 h1 h1 h1 h1"}\n <h2>{"content" : "h2 h2 h2 h2 h2 h2 h2"}\n <h3>{"content" : "h3 h3 h3 h3 h3 h3 h3"}\n}'
}

// parseLevel 1
info = {
	config: '{"tileRowType" : ["scroll", "scroll", "fixed"]}',
	content: '<h1>{"content" : "h1 h1 h1 h1 h1 h1 h1"}\n <h2>{"content" : "h2 h2 h2 h2 h2 h2 h2"}\n <h3>{"content" : "h3 h3 h3 h3 h3 h3 h3"}'
}

// parseLevel 2
info = {
	config: {
		tileRowType: ["scroll", "scroll", "fixed"]
	},
	content: {[h1#h1-1, h2#h2-2, h3#h3-3]}
}
​
```

### Function Args
 - **MakeElements:** you can access the [MakeElements](element.js.md#MakeElements) function inside an element like so:
```js
let elements = [{
	name : "btn",
	function : (info, element) => {
		buttontext = element.makeElements(`<p1>{"content" : "example"}`);
		// other code
	},
	style : {
		// h1 styles
	}
}];
```
 - **Element Count**: in the element arg of the function is a key called `elementCount`. This is a int that count's up by 1 every time an element is made it is useful for coming up with unique id's. Example:
```js
let elements = [{
	name : "h1",
	function : (info, element) => {
		info = Merge.dicts({ // Merge.dicts is imported from support/merger.js
			id: `${element.name}-${element.elementCount}`, // id 
		}, info);
	},
	style : {
		// h1 styles
	}
}];
```

### Other
 - **Referencing Other Elements**: You can reference the parts of other elements by naming the key, of the current element to the same name as the key, of the reference element and then setting the key, of the current element to the following pattern `<referenceElementName>` (this value should be a string) Here's a example:
```javascript
let elements = [{
	name : "h1",
	function : (info, element) => {
		// function
	},
	style : {
		// h1 styles
	}
}, {
	name : "h2",
	function : "<h1>", // gets the function from h1 so it doesn't need to be writen twice
	style : {
		// h2 styles
	}
}];
```
