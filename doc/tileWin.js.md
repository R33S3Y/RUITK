`tileWin.js` is a tool for making "tiles" that a positioned like windows in tilling window managers (Eg: [Hyprland](https://hyprland.org/)).

This functionally was/is presented in as a class full of functions as it predates [element.js](element.js.md) but has since been wrapped into the element as a part of the [Fallen Theme](fallen/Fallen%20Summary.md) and is stored in the  [tilewin.js](fallen/tilewin.js.md) module

# TileWin Class Documentation

The `TileWin` class creates and manages a flexible grid layout where tiles are dynamically positioned and resized based on configurable percentages. It supports both fixed and scrollable tiles and allows for animations, tile snapping, and content management.

## Table of Contents

- [Constructor](#constructor)
- [Methods](#methods)
    - [updateConfig](#updateconfig)
    - [updateStyle](#updatestyle)
    - [createTile](#createtile)
    - [update](#update)
    - [generate](#generate)
    - [append](#append)
    - [remove](#remove)
    - [destroy](#destroy)
    - [destroyAll](#destroyall)
    - [move](#`move(name,%20xSnap.%20ySnap)`)
    - [info](#`info(name)`)

---

## Constructor

```js
constructor()
```

The constructor initializes the `TileWin` instance and sets the default configuration and style. It prepares a set of default options, such as tile configuration, animation settings, and grid layout, and applies the default styles to the grid.

### Properties

- `this.tiles`: Array to store tile data.
- `this.idCounter`: Counter to generate unique IDs for each tile.
- `this.scrollTileStyle`: Style configuration for scrollable tiles.
- `this.fixedTileStyle`: Style configuration for fixed tiles.
- `this.config`: Configuration object
- `this.configStore`: Store to hold calculated grid information.

---

## Methods

### `updateConfig(config)`

```js
updateConfig(config = {})
```

Updates the configuration of the `TileWin` instance. It merges the new configuration with the default values and recalculates the necessary properties based on the updated configuration.

#### Parameters:

- `config`: Object containing the configuration to be updated.
	- `tileRowType`: Array defining tile types ("fixed" or "scroll").
    - `tilePercentageX`: Array defining the horizontal percentage distribution of tiles.
    - `tilePercentageY`: Array defining the vertical percentage distribution of tiles.
    - `tileDirection`: Direction of grid layout ("x" or "y").
    - `parent`: Parent element for rendering tiles. Follows the syntax of the [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) function
    - `transition`: CSS transition property for tile animations.

---

### `updateStyle(style)`

```js
updateStyle(style = {})
```

Updates the style properties of the grid and tiles, including scrollable and fixed tiles. It merges new style properties with the current ones and applies them to the elements.

#### Parameters:
- `style`: Object containing style properties to be updated. Follows the [Syntax of style.js](support/style.js.md#Syntax)

---

### `createTile(name, xSnap, ySnap, content = null)`

```js
createTile(name, xSnap, ySnap, content = null)
```

Creates a new tile with the specified properties and adds it to the grid. It validates the tile's name and position to ensure there are no conflicts.

#### Parameters:
- `name`: Unique identifier for the tile.
- `xSnap`: X-axis position for the tile. (Must be int and 0 or greater)
- `ySnap`: Y-axis position for the tile. (Must be int and 0 or greater)
- `content`: Content to be displayed inside the tile (optional).

---

### `update()`

```js
update()
```

Updates the grid layout and appends the tiles to the parent element as specified in the configuration. It manages the rendering of the tiles based on their type (fixed or scrollable).

---

### `generate()`

```js
generate()
```

Generates the layout and grid structure based on the configuration and the current tiles. It handles snapping, resizing, and positioning of tiles. The function supports both horizontal and vertical grid directions, calculating tile positions and sizes accordingly.

---

### `append(name, content)`

```js
append(name, content)
```

Appends new content to a tile specified by its name. If the tile already contains content, the new content is added to it.

#### Parameters:
- `name`: The name of the tile to append content to.
- `content`: The content to be appended (can be a string or an array of elements).

---

### `remove(name)`

```js
remove(name)
```

Removes content from a tile specified by its name. It resets the tile's content to an empty state.

#### Parameters:

- `name`: The name of the tile from which content will be removed.

---

### `destroy(name)`

```js
destroy(name)
```

Marks a tile for destruction, causing it to be removed from the grid during the next update.

#### Parameters:

- `name`: The name of the tile to be destroyed.

---

### `destroyAll()`

```js
destroyAll()
```

Marks all tiles for destruction, causing them to be removed from the grid during the next update.

---

### `move(name, xSnap. ySnap)`

```js
move(name, xSnap, ySnap)
```

Moves a tile.
#### Parameters:
- `name`: The name of the tile to be moved.
- `xSnap`: X-axis position for the tile. (Must be int and 0 or greater)
- `ySnap`: Y-axis position for the tile. (Must be int and 0 or greater)

- - -

### `info(name)`

```js
info(name = "")
```

Outputs info on a tile. If no tile name is inputted it will list all tile names
#### Parameters:
- `name`: The name of the tile to be moved. (optional)
#### Output Examples:
```js

console.log(tileWin.info());

//outputs
[ "tile1", "tile2" ]

console.log(tileWin.info("tile2"));

//outputs
{
	name : "tile2",
	id : 1,
	status : "rendered",
	destroy : false,
	xSnap : 0,
	ySnap : 0,
	snapShare : [[0,0],[1,1]],
	x : 0,
	y : 0,
	w : 0,
	h : 0,
	content : <div id="outerTile-4" class="KJCFGABFBF">,
}


```
## Usage Example

```js
let tileWin = new TileWin();

// Update configuration
tileWin.updateConfig({
  tileRowType : ["scroll", "scroll", "fixed"],
  tilePercentageX: [25, 25, 25, 25],
  tilePercentageY: [50, 50],
});

// Create a tile
tileWin.createTile("tile1", 0, 0, "This is a tile.");

// Append content to a tile
tileWin.append("tile1", "More content for tile 1.");

// Update the layout
tileWin.update();
```

---

## Notes

- Ensure that the total values in `tilePercentageX` and `tilePercentageY` add up to 100 to prevent layout issues.
- The grid supports both scrollable and fixed tiles, with their behavior controlled by the `tileRowType` configuration.
- Tile snapping is dynamically calculated based on the grid configuration and the snap positions specified for each tile.