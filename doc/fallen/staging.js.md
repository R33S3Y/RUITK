# Staging
### `staging.js`

The `staging.js` module serves as a testing and preparation area for new UI elements. All components in this file should be fully documented before moving to production.

### Icon

- **Purpose**: Displays an icon from [Breeze Icons](https://cdn.kde.org/breeze-icons/icons.html)
- **Inputs**:
    - `name`  (default: `"globe"`): automatically converts to the needed dashed case. So other example inputs include `"kdenliveAddClip"` or `"nodeTypeSymmetric"`
    - `size`  (default: `"var(--fontSizeP1)"`): sets the size of the icon. Defaults to the same as the [p1](base.js.md#p1,%20p2,%20p3) element
    - `color`  (default: `"var(--standout4)"`): sets the colour of the icon. Defaults to the same as the [p1](base.js.md#p1,%20p2,%20p3)  element
- **Behaviour**:
    - Accepts standard inputs

---
### Search

- **Purpose**: Provides a [Textbox](input.js.md#Textbox) with a callbacks that is run when the user press the search icon or enter but only if there's a difference in the text inputted
- **Inputs**:
    - `callback` (defaults to a console warning) 
- **Behaviour**:
    - Accepts standard inputs
    - Accepts the same inputs as [Textbox](input.js.md#Textbox) and has the same requirements

---