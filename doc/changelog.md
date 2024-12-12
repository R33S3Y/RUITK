# 0.9
#### support changes
 - fixed some bugs in `convert.js` that was causing outputted strings to be incorrectly when converting to `camelCase` 

## 0.8.5
#### documentation Changes
- made documentation for [convert.js](support/convert.js.md)
- reorganized the documentation for [fallen](fallen/Fallen%20Summary.md)
## 0.8.4
#### support changes
 - made a dependency called `convert.js` for converting strings between casing types eg: `camelCase` to `snake_case`
#### style.js changes
 - rewrote how the style function to support multiple flags at the same time.
 - added support for all css Pseudo-Classes that dont take args
#### documentation Changes
 - updated the documentation for [style.js](support/style.js.md)
#### Fallen Changes
 - More small improvements in `staging.js`
## 0.8.3
#### Fallen Changes
 - Added a file called `staging.js` for tests and in development of elements
 - Moved all elements from `input.js` to `staging.js`
 - Fiddled around with checkbox and radio buttons
#### documentation Changes
 - Added documentation the following fallen elements:
	 - [grid](fallen/Fallen%20Summary.md#grid)
	 - [backgroundImg](fallen/Fallen%20Summary.md#backgroundImg)
 - Added a note about the `style.js` change into the documentation
#### style.js changes
 - Add the ability to pass in a list into the style function
## 0.8.2
#### element.js Changes
 - bug fixed the `style_` feature
 - Changed style handling so `style` overwrites `style_`
#### Fallen Changes
 - Restructured most CSS
#### documentation Changes
 - Added a credit section to the [README](../README.md)
## 0.8.1
#### element.js Changes
 - Added Error Checking for element dependencies 
 - Added a new flag called `strictStyles` to control the `style_` feature
#### documentation Changes
 - updated the documentation for [element.js](element.js.md)
 - added new file called [Making Elements](Making%20Elements.md) just for explaining the process of making elements
# 0.8

#### tileWin.js Changes
 - Added a function called generate
 - Removed the need for `tile.js`
 - Removed `tile.js`
#### element.js Changes
 - element.js will now pass through the `makeElements` function into the a elements function via the element object.
 - element.js pass will pass through the new `parse` in the same manor to `makeElements`
 - Added an extra option to an element called `parseLevel`
 - Rewrote large chunks of the the `makeElements` function to better handle object nesting
 - Added a fix to allow it to handle arrays with the last item ending with a unnecessary comma
#### Fallen Changes
 - Added a tile called `tilewin` in the `tilewin.js` file 
#### documentation Changes
 - updated the documentation for [element.js](element.js.md)
#### Merger.js  Changes
 - Fixed a bug that was causing it to delete HTML elements
## 0.7.2
#### Fallen Changes
 - Fixed an issue with the `tile` not displaying properly when in a scroll tile
## 0.7.1

#### element.js Changes
 - Fixed a bug that was causing anything other all items passed into as info objects to be wrapped in an array
#### style.js changes
 - Fixed a bugs with `jsHover`
# 0.7
#### Licence Changes
 - Changed licence from Apache License 2.0 to the GPL V3
#### tileWin.js Changes
 - Fixed an issue with hover not working in scroll tiles in `updateTest` 
 - Changed `updateTest` to use the old fixed tile rendering method
 - Replace `update` with `updateTest` as it is deemed stable enough 
 - Removed `xNudge` and `yNudge` from `createTile`
 - Removed `tileNudgeFirst` and `tileNudgeSwap` from `configStore`
 - Added a function called `destory` to destroy a tile
 - Added a function called `destoryAll` to destroy all tiles
#### Fallen Changes
 - Fixed an issue with the `tile` element overflowing when using `updateTest`
 - Added an element to base called `u` for underline
 - Added an element to base called `a` for links
 - Changed wallpaper to a picture done by a friend of mine
 - Removed the `text` property from the base element
 - Removed the `init` function in `base.js`
 - Renamed all colors in fallen
#### style.js changes
 - Added a new flag called `jsHover`
#### tile.js Changes
 - Better error handling in the `append` function
#### documentation Changes
 - Made a full rundown on fallen at [Fallen Summary](fallen/Fallen%20Summary.md)

## 0.6.3
#### Fallen Changes
 - Changed all elements to use `elementCount` in there ID
#### element.js Changes
 - Added `elementCount` 
#### tileWin.js Changes
 - Added a function called `updateTest` for test a rework of the update function and removal of nudge
## 0.6.2
#### Fallen Changes
 - Made new file called `tilewin.js` for elements designed for `tileWin.js`
 - Moved element `backgroundImg` from `base` to `tileWin`
 - Removed the function `getTileWinStyle` from base
 - Added a element called `tile` to `tileWin` 
#### element.js Changes
 - Added an option called `handleStyle = false`
 - Swap the order of the inputs for the `append` function to be more consistent with other parts of the RUITK project
 - Fixed an issue with `makeElements` not properly handling arrays of elements
#### tileWin.js Changes
 - Changed the default style to be invisible making style optional.
#### documentation Changes 
 - Added documentation for the append function
## 0.6.1
#### Fallen Changes
 - Added the following elements
	 - `i`
	 - `grid` (Documentation needed)
 - Made all based element accept the `c` and `r` as args (Documentation needed)
 - Renamed `textAline` to `textAlign`
#### element.js Changes
 - Added check to prevent [style.js](support/style.js.md) from throwing a warning
#### documentation Changes 
 - Fixed a bunch of links
# 0.6
#### Fallen Changes
 - Renamed `main.js` to `base.js`
 - Renamed class `Theme` to `FallenBase`
 - Change all functions in `FallenBase` to static functions
 - Added a new function called `init`
 - Added the following elements to `base.js`
	 - `h1`
	 - `h2`
	 - `h3`
	 - `p2`
	 - `p3`
- Added more config options to `base` element
- Bug fixes to the Base elements
- Changed fallen to use the `declare` function provided in [V0.5](changelog.md#0.5)
#### element.js Changes
 - Rewrite of `makeElements` for better nesting handling
 - Added the a function called `append`  - [Documention](element.js.md#Append)
 - Added a error check of undefined names
#### style.js changes
 - Fixed a issue with the `declare` not adding new lines afterward
#### documentation Changes 
 - Added [Fallen Summary](fallen/Fallen%20Summary.md)
 - Added [The Base Element](fallen/The%20Base%20Element.md)

# 0.5
#### style.js changes
 - Added a new function called `declare` - [Documentation Here](support/style.js.md#Declare)
#### documentation Changes 
 - Added documentation changes for `query` and `declare` from `style.js`
#### tile.js Changes
 - Added a new function called `destory` to delete a tile
#### tileWin.js Changes
 - Scroll tiles will now take nudge into account when positioning thanks to a rewrite of how tile rendering and state handling work
 - Renamed `tileRowDirection` to `tileOppositeDirection` in `configStore`
 - Renamed `maxX` to `xMax` in `configStore`
 - Renamed `maxY` to `yMax` in `configStore`
## 0.4.1
#### tileWin.js Changes
 - Fixed a issue with scroll elements overlapping when there are multiple in the same row 
 - Remove the config option `createInnerTile` as it was made redundant in [V0.3](changelog.md#0.3)
 - Fixed a issue with scroll tiles that were animated not starting animation in center
 - Fixed a issue causing `tile.js`  to throw errors during expected behavior
 - Fixed a issue with scroll tiles ordering based off when they were made instead of there actual position (sorta)
#### Fallen
 - Renamed `fallen.js` to `main.js` as it is where the main/base components for the fallen theme will be stored.

# 0.4
#### tileWin.js Changes
 - Added a new function called `remove` that removes all content from a tile.
 - Changed the append function to only append things when update is called
#### Fallen
 - Added a new function called `getTileWinStyle` to store style info for `tileWin.js`
#### tile.js
 - Added a new function called `remove` that removes all content from a tile.


## 0.3.4
#### Fallen
 - Moved `favicon.ico` into the fallen folder
#### style.js changes
 - Added 16 new flags to style.js - [Full list](support/style.js.md######All%20Flags)
#### documentation Changes 
 - Fixed links in [README](../README.md)

## 0.3.3
#### style.js changes
 - Renamed the flag from `portrat` to `portrait` to fix a spelling mistake
#### documentation Changes
 - Added documentation about [Syntax](support/style.js.md#Syntax) and the [Style](support/style.js.md#Style) function from style.js

## 0.3.2
#### style.js changes
 - Added `forceOnFlags` to the style function as a optional argument
 - Added support for flags in the query function 
## 0.3.1
#### tileWin.js Changes
 - When making tiles tileWin.js will no longer make the tileP div element as it is no longer needed
 - Fixed issue with fixed tiles positions being absolute as apposed to fixed when `createInnerTile = true` in config

# 0.3
#### tileWin.js Changes
 - Renamed the `renderTiles` function to `update`
 - Removed the `tileGap` config option
 - Removed the `compensateForBorders` config option
 - Renamed the config option `tileRowtype` to `tileRowType`
 - Fixed inner tiles not working when `tileRowType = "scroll"`
 - Fixed issue with fixed tiles positions being absolute as apposed to fixed
 - Fixed issue with scroll tiles not updating or listing to there status
#### documentation Changes 
 - Added a new folder called support in doc to hold all support libs documentation
 - Added a guide on what makes a support library a support library in [support Library's Explanation](support%20Library's%20Explanation.md)
 - Added documentation about [MakeElements](element.js.md#MakeElements) and [AddElements](element.js.md#AddElements) from element.js
#### Fallen
 - Removed the `backgroundTile` element
 - Renamed the element `text1` to `p1`
#### element.js Changes
 - Added the ability to in a element reference parts of other elements [documentation here](element.js.md####Notes)
#### tile.js Changes
 - Changed the append function to be able to also accept lists of elements
# 0.2
 - Started new theme fallen
 - Added new example page
 - Added config option `createInnerTile = false` to tilewin.js
 - Added config option `transition : "all 0.2s ease-in-out"` to tilewin.js
 - Bugfixed element.js
 - Renamed the style element made my style.js to RUITKStyles
## 0.1.7
 - Updated readme
 - Renamed Project to RUITK
## 0.1.6
 - completed element.js
## 0.1.5
 - created element.js
 - Started change log
 - hopefully fleshed out file structure