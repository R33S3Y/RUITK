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
   - Each custom element should be defined with a `name`, a `function` to create the element, and a `style` object for applying CSS styles. For more info about elements go [Here](Making%20Elements.md)
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
- **Array Handling**: If a single element object is passed instead of an array, it is wrapped in an array for processing. So this also works:
```javascript
addElements(buttonElement);
```
- **Uniqueness Check**: Ensures each element name is unique in the collection, logging a warning and rejecting duplicates. Example:
```javascript
addElements(buttonElement);
addElements(buttonElement); // Logs a warning and rejects the duplicate
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