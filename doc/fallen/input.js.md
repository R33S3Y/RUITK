## Input
### `input.js`
`input.js` contains elements for user input. All element here accept [Standard Inputs](Fallen%20Summary.md#Standard%20Inputs)

### Textbox

- **Purpose**: Creates a single-line text input field.
- **Inputs**:
    - `idRoot` (optional): sets the Id of the grid element that holds this element. `id` sets the id of the input element instead
    - `question` (optional): Displayed label for the textbox.
    - `name` (needed): Name attribute for the group (defaults to `camelCase` of `question`) So you can get away with just inputting questions.
    - `placeholder` (default: `"Enter text"`): Placeholder text for the input.
    - `form` (default: `"default"`): Associates the textbox with a form group.
    - `type` (default: `"text"`): Defines the input type (e.g., `"text"`, `"password"`).
    - `spellcheck` (default: `false`): Enables/disables spell checking.
- **Behaviour**:
    - Accepts the [Standard Inputs](Fallen%20Summary.md#Standard%20Inputs)
    - Automatically converts `question` to `camelCase` for use as the `name` attribute.

---

### Radio

- **Purpose**: Creates a group of radio buttons for user selection.
- **Inputs**:
	- `idRoot` (optional): sets the Id of the grid element that holds this element. `id` sets the id of the input element instead
    - `question` (optional): The question to display above the radio buttons.
    - `options`: List of options for the user to select.
    - `name` (needed): Name attribute for the group (defaults to `camelCase` of `question`). So you can get away with just inputting questions.
    - `values` (needed): Internal values for options (defaults to `camelCase` of `options`). So you can get away with just inputting options.
    - `form` (default: `"default"`): Associates the radio buttons with a form group.
- **Behaviour**:
    - Generates radio buttons based on `options` and `values`.
    - Accepts the [Standard Inputs](Fallen%20Summary.md#Standard%20Inputs)
    - Includes styling for labels and buttons.
    - Handles user selection within a group.

---

### Checkbox

- **Purpose**: Similar to the `radio` component but allows for multiple selections.
- **Inputs**: Same as `radio`.
- **Behaviour**:
    - Generates checkboxes instead of radio buttons.
    - Accepts the [Standard Inputs](Fallen%20Summary.md#Standard%20Inputs)

---

### Dropdown

- **Purpose**: Creates a dropdown menu for user selection.
- **Inputs**:
	- `idRoot` (optional): sets the Id of the grid element that holds this element. `id` sets the id of the input element instead
    - `question` (optional): The question to display above the dropdown.
    - `options`: List of dropdown options.
    - `name` (needed): Name attribute for the group (defaults to `camelCase` of `question`). So you can get away with just inputting questions.
    - `values` (needed): Internal values for options (defaults to `camelCase` of `options`). So you can get away with just inputting options.
    - `form` (default: `"default"`): Associates the dropdown with a form group.
- **Behaviour**:
    - Accepts the [Standard Inputs](Fallen%20Summary.md#Standard%20Inputs)
    - Styles the dropdown and its options.

---

### Combo Box

- **Purpose**: Creates a text input with an associated `<datalist>` for user suggestions.
- **Inputs**:
    - Same as `dropdown`. and additionally: 
    - `list`(optional): The name to link the `<datalist>` with the input field. Think of it as a common ID to link the 2 together
- **Behaviour**:
    - Combines text input functionality with dropdown suggestions.
    - Accepts the [Standard Inputs](Fallen%20Summary.md#Standard%20Inputs)

---

### Button

- **Purpose**: A generic button element.
- **Inputs**:
    - `onClick` (default: Logs a warning): Function executed when the button is clicked (from [Standard Inputs](tileWin/doc/fallen/Fallen%20Summary.md#Standard%20Inputs))
    - `content` (default: `"Submit"`): Text or element to display inside the button.
- **Behaviour**:
    - Attaches a click event listener to execute the `callback`.
    - Accepts the [Standard Inputs](Fallen%20Summary.md#Standard%20Inputs)

---

### Submit

- **Purpose**: Submits data from all form elements associated with the specified `form`.
- **Inputs**:
    - `onSubmit`: Function executed on submission with form data as the argument.
    - `content` (default: `"Submit"`): Text or element to display inside the button.
    - `form` (default: `"default"`): Specifies the form to collect data from.
- **Behaviour**:
    - Collects values from `textbox`, `radio`, `checkbox`, `dropdown`, and `combo` elements and passes it into first argument the `onSubmit` Function
    - Executes the `callback` with the collected data.
    - Accepts the [Standard Inputs](Fallen%20Summary.md#Standard%20Inputs)