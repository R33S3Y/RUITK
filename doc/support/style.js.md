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
###### All Flags
**Selectors** - A list of currently supported css selectors - [List of css selectors - mdn web docs_](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors)
 - **active**
 - **after**
 - **before**
 - **checked**
 - **default**
 - **disabled**
 - **empty**
 - **enabled**
 - **focus**
 - **hover**
 - **indeterminate**
 - **invalid**
 - **link**
 - **optional**
 - **required**
 - **valid**
 - **visited**
**Other**
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
### `Style.style(element, style, forceOnFlags = "")`

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
styledElement = Style.style(element, styles, ["hover"]);
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

Here’s the documentation for the `declare` function following the style you provided:

---
# Query
### `Style.query(value, style)`

The `query` function retrieves the computed value of a specified CSS property from a dynamically created element styled with the given styles. This is useful for inspecting the final applied values of CSS properties, including those that depend on different states like hover.

#### Usage

1. **Define the CSS Property and Styles**:
   - Specify the CSS property you want to query, including any flags that indicate conditional styles.
   - Define the styles with appropriate flags for different states.
   - Example:
```javascript
let cssProperty = "hover_backgroundColor"; // Query for hover state
let styles = {
    backgroundColor: "red",
    hover_backgroundColor: "blue"
};
```

2. **Query the Property**:
   - Call the `query` function with the CSS property (including flags) and the style object.
   - Example:
```javascript
let result = Style.query(cssProperty, styles);
console.log(result); // Outputs the computed value of the hover_backgroundColor property
```

#### Notes
- **Dynamic Element Creation**: The function creates a temporary `<div>` element to apply the styles and compute property values.
- **Flags Handling**: Supports querying styles that are conditionally applied, such as those for hover states or other flags. The function automatically handles these flags to ensure the correct style is applied.
- **Cleanup**: The temporary element is removed from the document after retrieving the computed styles.

---
# Declare
### `Style.declare(vars)`

The `declare` function dynamically updates or adds CSS custom properties (variables) to the `:root` selector in a `<style>` element. It either merges new variables with existing ones or adds new properties if they don't already exist. This function is useful for managing CSS variables programmatically, ensuring that all variable definitions are up-to-date.

#### Usage

1. **Define Variables**:
   - Create a dictionary of CSS variables you want to declare or update.
   - Example:
```javascript
let newVars = {
    primaryColor: "#3498db",
    borderRadius: "8px",
    fontSize: "16px"
};
```

2. **Declare or Update Variables**:
   - Call the `declare` function with the dictionary of variables.
   - Example:
```javascript
Style.declare(newVars);
```
3. **Use when calling Style**
   - Example:
```js
let styles = {
	padding : "10px",
	margin : "0",
	fontFamily : "Arial, Helvetica, sans-serif",
	fontSize : "var(--fontSize)",
	color : "var(--primaryColor)",
};

styledElement = Style.style(element, styles);
```
#### Notes
- **CSS Custom Properties**: This function targets the `:root` selector to define global CSS variables.
- **Existing Variables**: If `:root` variables already exist, they are updated with new values; otherwise, the new variables are appended.
- **Dynamic Style Management**: The function uses a `<style>` element to manage CSS variable definitions, ensuring that they are reflected in the document's styles.

---