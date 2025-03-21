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
    - Accepts standard inputs
    - Automatically converts `question` to `camelCase` for use as the `name` attribute.

---

### Radio

- **Purpose**: Creates a group of radio buttons for user selection.
- **Inputs**:
	- `idRoot` (optional): sets the Id of the grid element that holds this element. `id` sets the id of the input element instead
    - `question` (optional): The question to display above the radio buttons.
    - `options`: List of options for the user to select.
    - `name` (optional): Name attribute for the group (defaults to `camelCase` of `question`).
    - `values` (optional): Internal values for options (defaults to `camelCase` of `options`).
    - `form` (default: `"default"`): Associates the radio buttons with a form group.
- **Behaviour**:
    - Generates radio buttons based on `options` and `values`.
    - Accepts standard inputs
    - Includes styling for labels and buttons.
    - Handles user selection within a group.

---

### Checkbox

- **Purpose**: Similar to the `radio` component but allows for multiple selections.
- **Inputs**: Same as `radio`.
- **Behaviour**:
    - Generates checkboxes instead of radio buttons.
    - Accepts standard inputs

---

### Dropdown

- **Purpose**: Creates a dropdown menu for user selection.
- **Inputs**:
	- `idRoot` (optional): sets the Id of the grid element that holds this element. `id` sets the id of the input element instead
    - `question` (optional): The question to display above the dropdown.
    - `options`: List of dropdown options.
    - `name` (optional): Name attribute for the dropdown.
    - `values` (optional): Internal values for options.
    - `form` (default: `"default"`): Associates the dropdown with a form group.
- **Behaviour**:
    - Accepts standard inputs
    - Styles the dropdown and its options.

---

### Combo Box

- **Purpose**: Creates a text input with an associated `<datalist>` for user suggestions.
- **Inputs**:
    - Same as `dropdown`.
    - Additional `list` attribute to link the `<datalist>` with the input field.
- **Behaviour**:
    - Combines text input functionality with dropdown suggestions.
    - Accepts standard inputs

---

### Button

- **Purpose**: A generic button element.
- **Inputs**:
    - `callback` (default: Logs a warning): Function executed when the button is clicked.
    - `content` (default: `"Submit"`): Text or element to display inside the button.
- **Behaviour**:
    - Attaches a click event listener to execute the `callback`.
    - Accepts standard inputs

---

### Submit

- **Purpose**: Submits data from all form elements associated with the specified `form`.
- **Inputs**:
    - `callback`: Function executed on submission with form data as the argument.
    - `content` (default: `"Submit"`): Text or element to display inside the button.
    - `form` (default: `"default"`): Specifies the form to collect data from.
- **Behaviour**:
    - Collects values from `textbox`, `radio`, `checkbox`, `dropdown`, and `combo` elements.
    - Executes the `callback` with the collected data.
    - Accepts standard inputs