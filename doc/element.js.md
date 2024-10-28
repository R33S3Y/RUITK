# MakeElements
### `makeElements(str)`

The `makeElements` function is designed to process a string containing custom element definitions and generate a corresponding array of elements based on predefined templates and styles. Each custom element in the string follows the pattern `<elementName>{...}`, where `elementName` represents the type of element and `{...}` contains the element-specific data in JSON format.

#### Usage

1. **Define Custom Elements**:
   - Your string should contain definitions of custom elements, each following the pattern `<elementName>{...}`.
   - Example:
```javascript
let str = '<button>{"label": "Click me"} <input>{"placeholder": "Enter text"}';
```

2. **Call the Function**:
   - Pass the string containing the custom elements to the `makeElements` function.
   - Example:
```javascript
let HTMLelements = elements.makeElements(str);
```

3. **Handle the Generated Elements**:
   - The function returns an array of generated elements based on the definitions provided in the input string.
   - You can then append these elements to the DOM or manipulate them as needed.
   - Example:
```javascript
HTMLelements.forEach(element => {
	document.body.appendChild(element);
});
```
 - It should be noted that the append function found in other parts of the RUITK project can accept lists like this. So these examples also work
```javascript
// element.js
elements.append("querySelector", HTMLelements);
// tileWin.js
tileWin.append("exampleTileName", HTMLelements);
```

#### Notes
- **Custom Elements**: Ensure that the custom element names and their corresponding JSON data match the predefined templates in your implementation.
- **Nested Elements**: The function can handle multiple nested elements, allowing you to create complex structures from a single string input.  Eg:
```js
elements.append("body", elements.makeElements(
	`<h1>{"content" : <b>{"content" : "Bold"} <i>{"content" : " italic"}}` 
));
```

- - -
# AddElements

### `addElements(elements = [])`

The `addElements` function allows you to add custom elements to a collection, ensuring that each element is unique by name. This function is particularly useful when you need to dynamically create and style various HTML elements based on predefined templates.

#### Usage

1. **Define Custom Elements**:
   - Each custom element should be defined with a `name`, a `function` to create the element, and a `style` object for applying CSS styles.
   - Example:
```javascript
let buttonElement = {
	name: "button1",
	function: (info, element) => {
		let btn = document.createElement("button");
		btn.textContent = info.label || "Default";
		return btn;
	},
	style: {
		transition: "all 0.2s ease-in-out",
		position: "absolute",
		overflow: "hidden",
		backgroundColor: "gray",
		backdropFilter: "blur(4px)",
		hover_backgroundColor: "darkgray",
		borderStyle: "solid",
		borderWidth: "3px",
		borderRadius: "15px",
		borderColor: "lightgray",
		boxShadow: "0 0 4px rgba(0, 0, 0, 1)",
		hover_boxShadow: "0 0 5px 2px rgba(0, 0, 0, 1)",
		hover_borderColor: "darkgray",
	}
};
```

2. **Call the Function**:
   - Pass an array of custom element definitions to the `addElements` function.
   - Example:
```javascript
addElements([buttonElement]);
```
#### Notes
- **Style Syntax**: Style Syntax is defined by [style.js](support/style.js.md) and there style function. Look there for up to date info
- **Array Handling**: If a single element object is passed instead of an array, it is wrapped in an array for processing. So this also works:
```javascript
addElements(buttonElement);
```
- **Uniqueness Check**: Ensures each element name is unique in the collection, logging a warning and rejecting duplicates. Example:
```javascript
addElements(buttonElement);
addElements(buttonElement); // Logs a warning and rejects the duplicate
```
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
 - **Handling the style property**: if you add `handleStyle : true` (by default it is set to false) to your elements definition you are now responsible for applying your elements styles. Eg:
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
 - **ParseLevel:** this value changes how much prepossessing the info object is going through. By default this value is set to 2 meaning that is fully processed with all the child elements sorted and things like that, 0 means it's a string so have fun with that and 1 means that the first level of dicts and arrays are processed but nothing more. this means that all contents of the first array are stringifyed.
 - **MakeElements:** you can access the [MakeElements](#MakeElements) function inside an element like so:
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
- - -

# Append
### `append(querySelector, content)`

The `append` function provides a quick and dirty way to handle get content on the page while providing support for lists of elements that the `makeElements` function spits out.

#### Usage 
```js
elements.append("body", HTMLelements);
```
For more info on the `querySelector` argument go to: [Document: querySelector() method - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) 