# Contents
 - [Project Goals](Fallen%20Summary.md#Project%20Goals)
 - [Files](Fallen%20Summary.md#Files)
 - [Elements](Fallen%20Summary.md#Elements)
	 - [Standard Inputs](Fallen%20Summary.md#Standard%20Inputs)
	 - [Base](Fallen%20Summary.md#Base)
		 - [h1, h2, h3](#h1,%20h2,%20h3)
		 - [p1, p2, p3](#p1,%20p2,%20p3)
	 - [TileWin](Fallen%20Summary.md#TileWin)
	 - [Input](Fallen%20Summary.md#Input)

# Project Goals
Fallen is collection of premade configurable elements for [element.js](element.js.md) with a constant theme and assets.
Fallen has the following goals:
1. To proved a constant theme that contains purple.
2. To provide a pseudo standard for [element.js](element.js.md)
3. To be easily expandable and rethemeable

# Files
Fallen is split into many different files these including pictures, icons and JavaScript. These JS files are what store the element definitions which follow the following conventions.
 -  The exported class is called `Fallen` + the file name Eg:
```js
import { FallenBase } from "/ruitk/themes/fallen/base.js";
import { FallenTileWin } from "/ruitk/themes/fallen/tileWin.js";
import { FallenInput } from "/ruitk/themes/fallen/input.js";
```
 - The elements are returned by a function called `getElements` this function requires no args and can be feed straight into [element.js](../element.js.md). Eg:
```js
elements.addElements(FallenBase.getElements());
elements.addElements(FallenTileWin.getElements());
elements.addElements(FallenInput.getElements());
```
# Elements
## Standard Inputs
In Fallen there's a Element called `base` although if you do call it [element.js](element.js.md) will throw an error. So why does this exist? Well it's there to store the generate function of course! The generate function handles many of the default values built into most elements in Fallen. (think of it like a dependency) Here a list of them and there default values and what they do:
 - `id` - Defaults to the Element name and the `element.elementCount` - sets `element.id`
 - `content` - Defaults to an empty string - anything you want appended including strings 
 - `x` - Defaults to an empty string - sets `element.style.left`
 - `y` - Defaults to an empty string - sets `element.style.top`
 - `w` - Defaults to "auto" - sets `element.style.width`
 - `h` - Defaults to "auto" - sets `element.style.height`
 - `c` - Defaults to an empty string - sets `element.style.gridColumn`
 - `r` - Defaults to an empty string - sets `element.style.gridRow`
 - `xAline` - Defaults to an empty string - Has 3 values "left", "center" & "right" if these values are passed in it will snap horizontally to that part of the parent
 - `yAline` - Defaults to an empty string - Has 3 values "top", "center" & "bottom" if these values are passed in it will snap vertically to that part of the parent
 - `textAlign` - Defaults to "left" - sets `element.innertext`
 - `position` - Defaults to "relative" but if `x`, `y`, `w`, `h`, `xAline` or `yAline` are changed it will instead default to "absolute" - sets `element.style.position`
 
The following elements do not accept these as input: 
**In `tileWin.js`**:
 - `backgroundImg`
 - `tile`
## Base
#### `base.js`
Base is meant to act as a dependency for other files as such it only contains some of the most basic elements.
### h1, h2, h3
All accept the [Standard Inputs](Fallen%20Summary.md#Standard%20Inputs) and output an h1, h2 & h3 elements respectively.
### p1, p2, p3
Also accept the [Standard Inputs](Fallen%20Summary.md#Standard%20Inputs) and output various shapes and sizes of p elements.
### b, u, i
B, u & i are for bold, underline and italic elements respectively. They also only accept the [Standard Inputs](#Standard%20Inputs). **Note:**  These element expects to be nested in p1, p2, p3, h1, h2 ,h3 elements for sizing info.
### a
A elements work just like [b, u & i](#b,%20u,%20i) elements but with the addition of the value `href` which defaults to a empty string and sets the `element.href` value.

## TileWin
#### `tileWin.js`

## Input
### `input.js`