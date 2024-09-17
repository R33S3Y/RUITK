# 0.7
### Examples 
 - removed the `tileWin test`
#### Tests 
 - Added a test called `tileWinTest`
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
 - Added an element to base called `u`
#### tile.js Changes
 - Better error handling in the `append` function
#### documentation Changes 
 - Updated [2. The Base Element](fallen/2.%20The%20Base%20Element.md)

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
 - Added [1. Fallen Summary](fallen/1.%20Fallen%20Summary.md)
 - Added [2. The Base Element](fallen/2.%20The%20Base%20Element.md)

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
 - Fixed links in [README](README.md)

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