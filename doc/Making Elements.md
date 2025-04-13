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
 - `style_*`  - If a dict key starts with `style_` it will be treated just like the style key this can be disabled by setting `strictStyles` to true.
 - `strictStyles` - Defaults to false - is used to disable the `style_` functionality. 
### Function Args
The function will have 2 args inputted: 
#### Info
`info` 
Which contains all the info inputted by the user. Eg: 
```js
element.makeElements(`<p1>{"content" : "example"}`);
//                         ^^^^^^^^^^^^^^^^^^^^^ <-- that bit
```
 **Note:** The format is set by the `parseLevel` setting

#### Element
`element` 
Which contains a copy of the element which can be access like this:
```js
let elements = [{
	name : "btn",
	function : (info, element) => {
		style = element.style
		// other code
	},
	style : {
		// btn styles
	}
}];
```
It also contains the following extra keys:
 - **MakeElements:** you can access the [MakeElements](element.js.md#MakeElements) function inside an element like so:
```js
let elements = [{
	name : "btn",
	function : (info, element) => {
		buttontext = element.makeElements(`<p1>{"content" : "example"}`);
		// other code
	},
	style : {
		// btn styles
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
 - **Parse**: is a function that can parse the raw strings that can inputted if `parseLevel` is set to  1 or 0 it has 2 inputs one for the str and one flag (set to false by default) that when set to true tells it to only parse the top level in the same manor as `parseLevel = 1`. Here's an example of it in use:
```js
let elements = [
    { // tilewin
        name : "tileWin",
        function : (info, element) => {
            info.config = element.parse(info.config);
            info.style = element.parse(info.style);
            info.tiles = element.parse(info.tiles, true);

            let tileWin = new TileWin();

            tileWin.updateConfig(info.config);
            tileWin.updateStyle(info.style);

            for (let tile of info.tiles) {

                tile = element.parse(tile, true);
                
                let content = tile.content;
				let elementStr = `<tile>{"content" : ${tile.content}}`;
				content = element.makeElements(elementStr);
				
                tileWin.createTile(tile.name, tile.x, tile.y, content);
            }
            return tileWin.generate();
        },
        style : {
            
        },
        handleStyle : true,
        parseLevel : 1,
    }
];
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
