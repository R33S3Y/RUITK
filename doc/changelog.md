# 0.3
### tileWin.js Changes
 - Renamed the `renderTiles` function to `update`
 - Removed the `tileGap` config option
 - Removed the `compensateForBorders` config option
 - Renamed the config option `tileRowtype` to `tileRowType`
 - Fixed inner tiles not working when `tileRowType = "scroll"`
 - Fixed issue with fixed tiles `postions` being absolute as apposed to fixed
 - Fixed issue with scroll tiles not updating or listing to there status
### documentation Changes 
 - Added a new folder called support in doc to hold all support libs documentation
 - Added a guide on what makes a support library a support library in [support Library's Explanation](support%20Library's%20Explanation.md)
 - Added documentation about [MakeElements](element.js.md#MakeElements) and [AddElements](element.js.md#AddElements) from element.js
### fallen.js
 - Removed the `backgroundTile` element
 - Renamed the element `text1` to `p1`
### element.js Changes
 - Added the ability to in a element reference parts of other elements [documentation here](element.js.md####Notes)
## tile.js Changes
 - Changed the append function to be able to also accept lists of elements
# 0.2
 - Started new theme fallen
 - Added new example page
 - Added config option createInnerTile : false to tilewin.js
 - Added config option transition : "all 0.2s ease-in-out", to tilewin.js
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