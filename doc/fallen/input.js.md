## Input
### `input.js`
There are no elements in `input.js` as of 0.8.3 as the have been moved to `staging.js` while they get there functions worked out.  


### Textbox

- **Purpose**: Creates a single-line text input field.
- **Inputs**:
    - `question` (optional): Displayed label for the textbox.
    - `name` (optional): Name attribute for the group (defaults to `camelCase` of `question`).
    - `placeholder` (default: `"Enter text"`): Placeholder text for the input.
    - `form` (default: `"default"`): Associates the textbox with a form group.
    - `type` (default: `"text"`): Defines the input type (e.g., `"text"`, `"password"`).
    - `spellcheck` (default: `false`): Enables/disables spell checking.
- **Behaviour**:
    - Adds standard styles and attributes.
    - Automatically converts `question` to `camelCase` for use as the `name` attribute.

---

### Radio

- **Purpose**: Creates a group of radio buttons for user selection.
- **Inputs**:
    - `question` (optional): The question to display above the radio buttons.
    - `options`: List of options for the user to select.
    - `name` (optional): Name attribute for the group (defaults to `camelCase` of `question`).
    - `values` (optional): Internal values for options (defaults to `camelCase` of `options`).
    - `form` (default: `"default"`): Associates the radio buttons with a form group.
- **Behaviour**:
    - Generates radio buttons based on `options` and `values`.
    - Includes styling for labels and buttons.
    - Handles user selection within a group.

---

### Checkbox

- **Purpose**: Similar to the `radio` component but allows for multiple selections.
- **Inputs**: Same as `radio`.
- **Behaviour**:
    - Generates checkboxes instead of radio buttons.
    - Handles multiple selections and returns an array of selected values.

---

### Dropdown

- **Purpose**: Creates a dropdown menu for user selection.
- **Inputs**:
    - `question` (optional): The question to display above the dropdown.
    - `options`: List of dropdown options.
    - `name` (optional): Name attribute for the dropdown.
    - `values` (optional): Internal values for options.
    - `form` (default: `"default"`): Associates the dropdown with a form group.
- **Behaviour**:
    - Generates a `<select>` element with `<option>` children.
    - Styles the dropdown and its options.

---

### Combo Box

- **Purpose**: Creates a text input with an associated `<datalist>` for user suggestions.
- **Inputs**:
    - Same as `dropdown`.
    - Additional `list` attribute to link the `<datalist>` with the input field.
- **Behaviour**:
    - Combines text input functionality with dropdown suggestions.
    - Dynamically generates the `<datalist>`.

---

### Button

- **Purpose**: A generic button element.
- **Inputs**:
    - `callback` (default: Logs a warning): Function executed when the button is clicked.
    - `content` (default: `"Submit"`): Text or element to display inside the button.
- **Behaviour**:
    - Attaches a click event listener to execute the `callback`.

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