`style.js` is a support lib that can among other things convert a dict into css styles using the style function

- - -
# Syntax

#### Basic's
`style.js` tries to be a very minimalist abstraction of CSS (basically CSS in a dictionary). So it shares all of it's style names with CSS, the only change is how it is written in camelCase

**Example:**

CSS:
```css
.element {
    border-style: solid;
    border-width: 3px;
    border-radius: 15px;
    border-color: rgba(87, 82, 108, 1);
    box-shadow: 0 0 4px rgba(0, 0, 0, 1);
}
```
JS dict:
```javascript
let style = {
	borderStyle : "solid",
	borderWidth : "3px",
	borderRadius : "15px",
	borderColor : "rgba(87, 82, 108, 1)",
	boxShadow : "0 0 4px rgba(0, 0, 0, 1)",
};
```

#### Flags
Now that's great but what happens if you want some hover action in `style.js`

**Example**

CSS:
```css
.element:hover {
    box-shadow: 0 0 5px 2px rgba(0, 0, 0, 1);
    border-color: rgba(193, 143, 179, 0.8);
}
```

Well then you can use flags. Here's a list of all current flags:
 - **hover** - same as the `:hover` selector - [mdn web docs_](https://developer.mozilla.org/en-US/docs/Web/CSS/:hover)
 - **portrait** - only apply this style when `window.innerHeight > window.innerWidth === true`
 - **landscape** - only apply this style when `window.innerWidth >= window.innerHeight === true`

you can apply flags in one of two ways
1. Subdicts - you can make a subdict with the flags name.
```js
let style = {
	hover : {
		boxShadow: "0 0 5px 2px rgba(0, 0, 0, 1)",
		borderColor : "rgba(193, 143, 179, 0.8)",
	}
}
```
2. inline - you can in front of the key write the flag name followed by a underscore. You can even use this to apply multiple flags in some cases.
```js
let style = {
	hover_boxShadow: "0 0 5px 2px rgba(0, 0, 0, 1)",
	hover_borderColor : "rgba(193, 143, 179, 0.8)",
}
```
 - - - 
# Style
### `style(element, style, forceOnFlags = "")`

The `style` function applies a given set of CSS styles to an HTML element dynamically. It ensures that styles are consistently applied across multiple uses by generating unique class names based on the styles and applying them to the element. This function also handles conditional styles for different states such as hover, landscape, and portrait modes.

#### Usage

1. **Define the Element and Styles**:
   - Create an HTML element.
   - Define a style object with the desired CSS properties.
   - Example:
```javascript
let element = document.createElement('div');
let styles = {
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
	hover_borderColor: "darkgray"
};
```

2. **Apply Styles**:
   - Call the `style` function with the element and style object.
   - Optionally, include flags to force certain styles.
   - Example:
```javascript
styledElement = style(element, styles, ["hover"]);
```

3. **Add to the DOM**:
   - Append the styled element to the DOM.
   - Example:
```javascript
document.body.appendChild(styledElement);
```
#### Notes
- **Dynamic Class Generation**: The function generates a unique class name for each set of styles to ensure consistency.
- **Conditional Styles**: Handles conditional styles for states like hover, landscape, and portrait modes.
- **Flag Handling**: Allows forcing certain styles by passing flags such as `["hover", "landscape"]`.