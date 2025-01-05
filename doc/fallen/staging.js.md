## Staging
### `staging.js`
Staging is meant as a area for testing and preparation. All elements in staging should have documentation in this file before leaving.
### textbox

### radio
it's a radio button question. it accepts the [Standard Inputs](Fallen%20Summary.md#Standard%20Inputs) as well as:
 - `question` - The name of the question that gets displayed
 - `options` - A list of the options you want to give the user
 - `name` - Optional - The name of the question (used kinda like an id) - defaults to `question` converted into `camelCase`
 - `values` - Optional - used as the behind the scenes version of `options` - defaults to `options` with all the strings in the list converted into `camelCase`
### checkbox
it's a checkbox question. it uses the same inputs as the [radio](#radio) element in the same way (to the point of even sharing all of the code).
### dropdown

### combo

### button

### submit

**_Please note this module is missing documentation_**
