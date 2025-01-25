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

### grid
Grid is an invisible grid meant for organizing and moving around elements. it uses the [Standard Inputs](Fallen%20Summary.md#Standard%20Inputs) as well as all the ones shown here: 
 - Input name - CSS Value Changed - Default value
 - `rTemplate` - `grid.style.gridTemplateRows` - `"auto"`
 - `cTemplate` - `grid.style.gridTemplateColumns` - `"auto"`
 - `gap` - `grid.style.gridGap` - `"0"`
 - `areas` - `grid.style.gridTemplateAreas` - `"initial"` 
 - `justifyContent` - `grid.style.justifyContent` - `"space-between"`