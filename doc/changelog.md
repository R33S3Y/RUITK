# 0.5
#### tile.js Changes
 - Added a new function called `destory` to delete a tile
#### tileWin.js Changes
 - Scroll tiles will now take nudge into account when positioning
 - Added a option to `configStore` called `cleanScrollAnimationFix = true`
 - Renamed `tileRowDirection` to `tileOppositeDirection` in `configStore`
 - Renamed `maxX` to `xMax` in `configStore`
 - Renamed `maxY` to `yMax` in `configStore`
## 0.4.1
#### tileWin.js Changes
 - Fixed a issue with scroll elements overlapping when there are multiple in the same row 
 - Remove the config option `createInnerTile` as it was made redundant in [V0.3](tileWin/doc/changelog.md#0.3)
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