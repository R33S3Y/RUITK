# Staging
### `staging.js`

The `staging.js` module serves as a testing and preparation area for new UI elements. All components in this file should be fully documented before moving to production.

### Icon

- **Purpose**: Displays an icon from [Breeze Icons](https://cdn.kde.org/breeze-icons/icons.html)
- **Inputs**:
    - `name`  (default: `"globe"`): automatically converts to the needed dashed case. So other example inputs include `"kdenliveAddClip"` or `"nodeTypeSymmetric"`
    - `size`  (default: `"var(--fontSizeP1)"`): sets the size of the icon. Defaults to the same as the [p1](base.js.md#p1,%20p2,%20p3) element
    - `color`  (default: `"var(--standout4)"`): sets the color of the icon. Defaults to the same as the [p1](base.js.md#p1,%20p2,%20p3)  element
    - `hoverColor` (defaults to `color`): sets the color the the icon is getting hovered over
- **Behaviour**:
    - Accepts the [Standard Inputs](Fallen%20Summary.md#Standard%20Inputs)

---
### Search

- **Purpose:** Provides a [Textbox](input.js.md#Textbox) with a callbacks that is run when the user press the search icon or enter but only if there's a difference in the text inputted
- **Inputs**:
    - `callback` (defaults to a console warning) 
- **Behaviour**:
    - Accepts the [Standard Inputs](Fallen%20Summary.md#Standard%20Inputs)
    - Accepts the same inputs as [Textbox](input.js.md#Textbox) and has the same requirements

---
### Img

 - **Purpose:** Displays an image
 - **Inputs:**
	 - `src` (required): The link to the image
	 - `alt` (required): The alt text describing the image
- **Behaviour:**
	- Accepts the [Standard Inputs](Fallen%20Summary.md#Standard%20Inputs)

---
