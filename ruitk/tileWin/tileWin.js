import { Tile } from "../support/tile.js";
import { List2D } from "../support/list2D.js";
import { Merge } from "../support/merger.js";
import { Style } from "../support/style.js";

export class TileWin {
    constructor() {
        this.tiles = [];

        this.idCounter = 0;

        this.scrollTileStyle = {};
        this.fixedTileStyle = {};
        this.config = {
            tileRowType : ["fixed", "fixed", "fixed"],
            tilePercentageX : [20,40,40],
            tilePercentageY : [20,40,40],
            tileDirection : "y",
            parent : "body",
            animateOnCreateTile : true,
            transition : "all 0.2s ease-in-out",
            useUpdateTest : false,
        }
        this.updateConfig(); // run to make this.configStore

        this.updateStyle({
            transition : this.config.transition,
            backgroundColor : "rgba(0, 0, 0, 0)",
            borderColor : "rgba(0, 0, 0, 0)",
            position : "absolute",
        });
    }

    updateConfig(config = {}) {
        config = Merge.dicts(this.config, config, [0, "", [], null]);

        this.config = config;

        this.configStore = {
            tileSnapFirst : this.config.tileDirection,
            tileNudgeFirst : this.config.tileDirection,
            tileOppositeDirection : this.config.tileDirection,
            tileNudgeSwap : true,
            xMax : this.config.tilePercentageX.length,
            yMax : this.config.tilePercentageY.length,
        }
        this.configStore.tileOppositeDirection = this.config.tileDirection === "y" ? "x" : "y";

        return;
    }

    updateStyle(style = {}) {
        style = Merge.dicts(this.style, style, [0, "", [], null]);
        style.position = "static";
        this.tileStyle = style;

        // needed for old update
        style = JSON.parse(JSON.stringify(style));
        style.position = "relative";
        style.boxSizing = "border-box";
        this.scrollTileStyle = style;
        style = JSON.parse(JSON.stringify(style));
        style.position = "fixed";
        this.fixedTileStyle = style;
        return;
    }

    createTile(name, xSnap, xNudge, ySnap, yNudge, content = null) {
        for (let tile of this.tiles) {
            if (tile.name === name) {
                console.error(`tile name ${name} is already in use by tile id: ${tile.id}`);
                return;
            }
            if (tile.xSnap === xSnap && tile.xNudge === xNudge && tile.ySnap === ySnap && tile.yNudge === yNudge) {
                console.warn(`tile ${name} is in the same location as ${tile.name} please change Nudge`);
            }
        }
        let newTile = {
            name : name,
            id : this.idCounter,
            status : "unrendered",

            xSnap : xSnap,
            xNudge : xNudge,

            ySnap : ySnap,
            yNudge : yNudge,

            snapShare : [[0,0],[1,1]],

            x : 0,
            y : 0,
            w : 0,
            h : 0,

            content : content
        };
        this.idCounter ++;
        this.tiles.push(newTile);
    }

    update() {
        if (this.config.useUpdateTest === true) {
            this.updateTest();
            return;
        }

        let rowManagerStyles = {
            transition : this.config.transition,
            backgroundColor : "rgba(0, 0, 0, 0)",
            borderColor : "rgba(0, 0, 0, 0)",
            position : "absolute",
        };
        let subRowManagerStyles = {
            backgroundColor : "rgba(0, 0, 0, 0)",
            borderColor : "rgba(0, 0, 0, 0)",
            position : "relative",
            display : "flex",
            alignItems : "stretch",
        }
        
        function animateTile(id, x, y, w, h, t) {
            if (t.config.animateOnCreateTile === true) {
                Tile.transform(`tile${id}`, `calc(${x} + (${w} / 2))`, `calc(${y} + (${h} / 2))`, 0, 0);
                setTimeout(() => {
                    Tile.transform(`tile${id}`, x, y, w, h);
                }, 0);
            }
        } 
        function makeTile(tile, id, x, y, w, h, p, content, t) {
            let { wInner, hInner } = calcWInnerAndHInner(tile, w, h, t);
            
            if (t.config.tileRowType[tile[`${t.configStore.tileOppositeDirection}Snap`]] === "fixed") {
                Tile.create(`tile${id}`, x, y, wInner, hInner, t.fixedTileStyle, p);
            } else {
                Tile.create(`tile${id}`, x, y, wInner, hInner, t.scrollTileStyle, p);
            }
            animateTile(id, x, y, wInner, hInner, t);
            if (tile.content !== null) {
                Tile.append(`tile${id}`, tile.content);
            }
        }
        function calcWInnerAndHInner(tile, w, h, t) {
            let wInner = `calc(${w} - (${Style.query("marginLeft", t.fixedTileStyle)} + ${Style.query("marginRight", t.fixedTileStyle)}))`;
            let hInner = `calc(${h} - (${Style.query("marginTop", t.fixedTileStyle)} + ${Style.query("marginBottom", t.fixedTileStyle)}))`;

            if (t.config.tileRowType[tile[`${t.configStore.tileOppositeDirection}Snap`]] !== "fixed") {
                if(t.config.tileDirection === "y") {
                    hInner = "auto";
                } else {
                    wInner = "auto";
                }
            }

            return { wInner, hInner };
        }
        

        let tileLayout = List2D.create(this.configStore.xMax, this.configStore.yMax, false);
        let tileLayoutLength = List2D.create(this.configStore.xMax, this.configStore.yMax, 0);
        // add items to layout
        for (let tile of this.tiles) {
            tileLayout[tile.xSnap][tile.ySnap] = true;
            tileLayoutLength[tile.xSnap][tile.ySnap]++;
        }

        // [[x1,y1],[x2,y2]]
        let snapResize = List2D.create(3,3,[[0,0],[1,1]]);
        snapResize = JSON.parse(JSON.stringify(snapResize));
        
        // Snaps
        function resizeRow(itemTotals = []) {
            let itemSize = Array(itemTotals.length).fill([0,0]);
            itemSize = JSON.parse(JSON.stringify(itemSize));
            // default values
            let seenTrue = false;
            let sinceTrue = 0;
            for (let i = 0; i < itemTotals.length; i++) {
                if (itemTotals[i] === true) {
                    // set defaults
                    itemSize[i][0] = i;
                    itemSize[i][1] = i+1;
                    if (sinceTrue > 0) {
                        // last snap was false/empty/dead
                        if (seenTrue === true) {
                            //is other snap so must share dead snap
                            itemSize[i-sinceTrue-1][1] = (i-sinceTrue)+(sinceTrue/2);
                            itemSize[i][0] = i-(sinceTrue/2);
                        } else {
                            itemSize[i][0] = i-sinceTrue;
                        }

                    }
                    
                    seenTrue = true;
                    sinceTrue = 0;
                } else {
                    sinceTrue++;
                }
            }
            if (sinceTrue > 0) {
                //last snap is empty/dead
                if (seenTrue === true) {
                    // there is a live snap to grow
                    itemSize[itemTotals.length-sinceTrue-1][1] = itemTotals.length;
                }
            }

            return itemSize;
        }
        if (this.configStore.tileSnapFirst === "y") {
            // Snap Major axis
            for (let x in tileLayout) {
                let resizeValues = resizeRow(List2D.getListY(x, tileLayout));
                for (let y in snapResize[x]) {
                    snapResize[x][y][0][1] = resizeValues[y][0];
                    snapResize[x][y][1][1] = resizeValues[y][1];
                };
            }

            // Snap Minor axis
            let xList = Array(this.configStore.xMax).fill(false);
            for (let x in tileLayout) {
                if(List2D.getListY(x, tileLayout).some(item => item === true)) {
                    xList[x] = true;
                }
            }
            let resizeValues = resizeRow(xList);
            for (let x in snapResize) {
                for (let i = 0; i < snapResize[x].length; i++) {
                    snapResize[x][i][0][0] = resizeValues[x][0];
                    snapResize[x][i][1][0] = resizeValues[x][1];
                }
            }
        } else {// "x"
            // Snap Major axis
            for (let y in tileLayout[0]) {
                let resizeValues = resizeRow(List2D.getListX(y, tileLayout));
                for (let x in snapResize) {
                    snapResize[x][y][0][0] = resizeValues[x][0];
                    snapResize[x][y][1][0] = resizeValues[x][1];
                };
            }

            // Snap Minor axis
            let yList = Array(this.configStore.yMax).fill(false);
            for (let y in tileLayout[0]) {
                if(List2D.getListX(y, tileLayout).some(item => item === true)) {
                    yList[y] = true;
                }
            }
            let resizeValues = resizeRow(yList);
            for (let y in snapResize[0]) {
                for (let i = 0; i < snapResize.length; i++) {
                    snapResize[i][y][0][1] = resizeValues[y][0];
                    snapResize[i][y][1][1] = resizeValues[y][1];
                }
            }
        }
        console.debug(snapResize);
        // nudge code
        for (let x = 0; x < tileLayoutLength.length; x++) {
            for (let y = 0; y < tileLayoutLength[x].length; y++) {
                if (tileLayoutLength[x][y] <= 1) {
                    continue;
                }
        
                let overLappingTiles = [];
                for (let i in this.tiles) {
                    let tile = this.tiles[i];
                    if (tile.xSnap === x && tile.ySnap === y) {
                        overLappingTiles.push(tile);
                    }
                }
        
                let currentSplit = this.configStore.tileNudgeFirst;
                let leftOverSpace = [[0,0],[1,1]];

                while (overLappingTiles.length > 0) {
                    if (overLappingTiles.length <= 1) {
                        for (let i in this.tiles) {
                            let tile = this.tiles[i];
                            if (tile.id === overLappingTiles[0].id) {
                                tile.snapShare = leftOverSpace;
                            }
                        }
                        break;
                    }

                    overLappingTiles.sort((a, b) => b[`${currentSplit}Nudge`] - a[`${currentSplit}Nudge`]);
        
                    let split;
                    let takenSpace = JSON.parse(JSON.stringify(leftOverSpace));
        
                    if (currentSplit === "y") {
                        split = (leftOverSpace[0][1] + leftOverSpace[1][1]) / 2;
                        takenSpace[1][1] = split;
                        leftOverSpace[0][1] = split; 
                    } else {
                        split = (leftOverSpace[0][0] + leftOverSpace[1][0]) / 2;
                        takenSpace[1][0] = split;
                        leftOverSpace[0][0] = split; 
                    }
                    
                    for (let i in this.tiles) {
                        let tile = this.tiles[i];
                        if (tile.id === overLappingTiles[0].id) {
                            tile.snapShare = takenSpace;
                        }
                    }
                    overLappingTiles.shift();
        
                    if (this.configStore.tileNudgeSwap === true) {
                        currentSplit = currentSplit === "y" ? "x" : "y";
                    }
                }
            }
        }
        
        // render code
        

        // this block of code converts how much of the screen a snap should take up to how far it is from 0,0
        let tileDistanceX = [0];
        for (let i = 0; i < this.config.tilePercentageX.length; i++) {
            tileDistanceX.push(tileDistanceX[i] + this.config.tilePercentageX[i]);
        }
        if (tileDistanceX[tileDistanceX.length - 1] !== 100) {
            console.warn("the total of tilePercentageX is not 100 meaning tileWin will ether overflow or underflow");
        }
        let tileDistanceY = [0];
        for (let i = 0; i < this.config.tilePercentageY.length; i++) {
            tileDistanceY.push(tileDistanceY[i] + this.config.tilePercentageY[i]);
        }
        if (tileDistanceY[tileDistanceX.length - 1] !== 100) {
            console.warn("the total of tilePercentageY is not 100 meaning tileWin will ether overflow or underflow");
        }

        /**
         * The tilePercentageX & Y values and tileDistanceX & Y[-1] = 100 are necessary for calculating wSnapPercent and hSnapPercent.
         * These calculations work by determining the x or y value at the end of the tile and subtracting the actual x or y value, leaving the difference.
         * Since there is technically no border between tiles, when calculating the end x and y values, it will reference the next row or column.
         * However, at the last row or column, you can't reference the next one, which would cause an error.
         * To prevent this, we add an extra value.
         * For tilePercentage, it just needs to be a number to avoid errors.
         * For tileDistance, it needs to be equal to 100.
         */
        let tilePercentageX = [...this.config.tilePercentageX];
        tilePercentageX.push(0);
        let tilePercentageY = [...this.config.tilePercentageY];
        tilePercentageY.push(0);
        
        
        // Make tiles
        for (let i in this.tiles) {
            let tile = this.tiles[i];

            tile.xSnapPercent = tileDistanceX[Math.floor(snapResize[tile.xSnap][tile.ySnap][0][0])] +
            (tilePercentageX[Math.floor(snapResize[tile.xSnap][tile.ySnap][0][0])] * (snapResize[tile.xSnap][tile.ySnap][0][0] % 1));
            tile.ySnapPercent = tileDistanceY[Math.floor(snapResize[tile.xSnap][tile.ySnap][0][1])] +
            (tilePercentageY[Math.floor(snapResize[tile.xSnap][tile.ySnap][0][1])] * (snapResize[tile.xSnap][tile.ySnap][0][1] % 1));

            tile.wSnapPercent = (tileDistanceX[Math.floor(snapResize[tile.xSnap][tile.ySnap][1][0])] +
            (tilePercentageX[Math.floor(snapResize[tile.xSnap][tile.ySnap][1][0])] * (snapResize[tile.xSnap][tile.ySnap][1][0] % 1))) - tile.xSnapPercent;
            tile.hSnapPercent = (tileDistanceX[Math.floor(snapResize[tile.xSnap][tile.ySnap][1][1])] +
            (tilePercentageX[Math.floor(snapResize[tile.xSnap][tile.ySnap][1][1])] * (snapResize[tile.xSnap][tile.ySnap][1][1] % 1))) - tile.ySnapPercent;

            tile.x = tile.xSnapPercent + (tile.wSnapPercent * tile.snapShare[0][0]); // snapShare is for applying nudge to tiles
            tile.y = tile.ySnapPercent + (tile.hSnapPercent * tile.snapShare[0][1]); // snapShare is relative value therefore the Snap vars just need to state how big the snap should be

            tile.w = tile.wSnapPercent * (tile.snapShare[1][0] - tile.snapShare[0][0]);
            tile.h = tile.hSnapPercent * (tile.snapShare[1][1] - tile.snapShare[0][1]);
        }

        let sortedTiles = Array(this.configStore[`${this.configStore.tileOppositeDirection}Max`]).fill([]);
        sortedTiles = JSON.parse(JSON.stringify(sortedTiles));
        let somewhatSortedtiles = Array(this.configStore[`${this.configStore.tileOppositeDirection}Max`]).fill([]);
        somewhatSortedtiles = JSON.parse(JSON.stringify(somewhatSortedtiles));
        for (let tile of this.tiles) {
            somewhatSortedtiles[tile[`${this.configStore.tileOppositeDirection}Snap`]].push(tile);
        }
        for (let i in somewhatSortedtiles) {
            somewhatSortedtiles[i].sort((a , b) => {return a[`${this.config.tileDirection}Snap`] - b[`${this.config.tileDirection}Snap`]});
            if (this.config.tileRowType[i] === "fixed") {
                sortedTiles[i] = somewhatSortedtiles[i];
                continue;
            }
            
            let groupedByA = {}; // a = this.config.tileDirection
            somewhatSortedtiles[i].forEach(tile => {
                if (!groupedByA[tile[this.config.tileDirection]]) {
                    groupedByA[tile[this.config.tileDirection]] = [];
                }
                groupedByA[tile[this.config.tileDirection]].push(tile);
            });

            for (let a in groupedByA) {
                groupedByA[a].sort((a, b) => a[this.configStore.tileOppositeDirection] - b[this.configStore.tileOppositeDirection]);
            }

            sortedTiles[i] = Object.values(groupedByA);
        }

        function tileUpdates(tile, t, i=0, j=0, k=0,) {
            if (t.config.tileRowType[tile[`${t.configStore.tileOppositeDirection}Snap`]] === "fixed") {

                let { wInner, hInner } = calcWInnerAndHInner(tile, `${tile.w}%`, `${tile.h}%`, t);
                
                Tile.transform(`tile${tile.id}`, `${tile.x}%`, `${tile.y}%`, wInner, hInner);
            } else {
                let tileElement = document.getElementById(`tile${tile.id}`);
                let parentElementId = tileElement.parentElement.id;
                
                let match = parentElementId.match(/subRowManager(\d+)-(\d+)/);
                let iOld = parseInt(match[1]);
                let jOld = parseInt(match[2]);

                tileElement.style.order = k;

                if (iOld !== i || jOld !== j) {
                    document.getElementById(`subRowManager${i}-${j}`).appendChild(tileElement);
                }
                
            }

            if (tile.status === "contentChanged") {
                Tile.remove(`tile${tile.id}`);
                Tile.append(`tile${tile.id}`, tile.content);
            }
        }

        for (let i = 0; i < sortedTiles.length; i++) {
            let row = sortedTiles[i];
            
            if (this.config.tileRowType[i] === "fixed") {
                for (let j = 0; j < row.length; j++) {
                    let tile = row[j];
                    if (tile.status === "unrendered") {
                        makeTile(tile, tile.id, `${tile.x}%`, `${tile.y}%`, `${tile.w}%`, `${tile.h}%`, this.config.parent, tile.content, this);
                        tile.status = "rendered";
                    } else {
                        tileUpdates(tile, this);
                    }
                }
                continue;
            }

            // create row manager
            if (document.querySelector(`#rowManager${i}`) === undefined || document.querySelector(`#rowManager${i}`) === null) {
                if (this.configStore.tileOppositeDirection === "x") {
                    Tile.create(`rowManager${i}`, `${row[0][0].xSnapPercent}%`, 0, `${row[0][0].wSnapPercent}%`, "auto", rowManagerStyles, this.config.parent);
                } else {
                    Tile.create(`rowManager${i}`, 0, `${row[0][0].ySnapPercent}%`, "auto", `${row[0][0].hSnapPercent}%`, rowManagerStyles, this.config.parent);
                }
            }
            for (let j = 0; j < row.length; j++) {
                let subRow = row[j];
                // create sub row manager
                if (document.querySelector(`#subRowManager${i}-${j}`) === undefined || document.querySelector(`#subRowManager${i}-${j}`) === null) {
                    if (this.configStore.tileOppositeDirection === "x") {
                        Tile.create(`subRowManager${i}-${j}`, 0, 0, "100%", "auto", subRowManagerStyles, `#rowManager${i}`);
                    } else {
                        Tile.create(`subRowManager${i}-${j}`, 0, 0, "auto", "100%", subRowManagerStyles, `#rowManager${i}`);
                    }
                }
                for (let k = 0; k < subRow.length; k++) {
                    let tile = subRow[k];
                    if (tile.status === "unrendered") {
                        if (this.configStore.tileOppositeDirection === "x") {
                            makeTile(tile, tile.id, "0%", "0%", `${(tile.snapShare[1][0] - tile.snapShare[0][0])*100}%`, "auto", `#subRowManager${i}-${j}`, tile.content, this);
                        } else {
                            makeTile(tile, tile.id, "0%", "0%", "auto", `${(tile.snapShare[1][0] - tile.snapShare[0][0])*100}%`, `#subRowManager${i}-${j}`, tile.content, this);
                        }
                        let tileElement = document.getElementById(`tile${tile.id}`);
                        tileElement.style.order = k;
                        tile.status = "rendered";
                    } else {
                        tileUpdates(tile, this, i, j, k);
                    }
                }
            }
        }
    }

    updateTest () {

        /**
         * Old Code (Solen From old update) to make snapResize
         */

        let tileLayout = List2D.create(this.configStore.xMax, this.configStore.yMax, false);
        let tileLayoutLength = List2D.create(this.configStore.xMax, this.configStore.yMax, 0);
        // add items to layout
        for (let tile of this.tiles) {
            tileLayout[tile.xSnap][tile.ySnap] = true;
            tileLayoutLength[tile.xSnap][tile.ySnap]++;
        }

        // [[x1,y1],[x2,y2]]
        let snapResize = List2D.create(3,3,[[0,0],[1,1]]);
        snapResize = JSON.parse(JSON.stringify(snapResize));
        
        // Snaps
        function resizeRow(itemTotals = []) {
            let itemSize = Array(itemTotals.length).fill([0,0]);
            itemSize = JSON.parse(JSON.stringify(itemSize));
            // default values
            let seenTrue = false;
            let sinceTrue = 0;
            for (let i = 0; i < itemTotals.length; i++) {
                if (itemTotals[i] === true) {
                    // set defaults
                    itemSize[i][0] = i;
                    itemSize[i][1] = i+1;
                    if (sinceTrue > 0) {
                        // last snap was false/empty/dead
                        if (seenTrue === true) {
                            //is other snap so must share dead snap
                            itemSize[i-sinceTrue-1][1] = (i-sinceTrue)+(sinceTrue/2);
                            itemSize[i][0] = i-(sinceTrue/2);
                        } else {
                            itemSize[i][0] = i-sinceTrue;
                        }

                    }
                    
                    seenTrue = true;
                    sinceTrue = 0;
                } else {
                    sinceTrue++;
                }
            }
            if (sinceTrue > 0) {
                //last snap is empty/dead
                if (seenTrue === true) {
                    // there is a live snap to grow
                    itemSize[itemTotals.length-sinceTrue-1][1] = itemTotals.length;
                }
            }

            return itemSize;
        }
        if (this.configStore.tileSnapFirst === "y") {
            // Snap Major axis
            for (let x in tileLayout) {
                let resizeValues = resizeRow(List2D.getListY(x, tileLayout));
                for (let y in snapResize[x]) {
                    snapResize[x][y][0][1] = resizeValues[y][0];
                    snapResize[x][y][1][1] = resizeValues[y][1];
                };
            }

            // Snap Minor axis
            let xList = Array(this.configStore.xMax).fill(false);
            for (let x in tileLayout) {
                if(List2D.getListY(x, tileLayout).some(item => item === true)) {
                    xList[x] = true;
                }
            }
            let resizeValues = resizeRow(xList);
            for (let x in snapResize) {
                for (let i = 0; i < snapResize[x].length; i++) {
                    snapResize[x][i][0][0] = resizeValues[x][0];
                    snapResize[x][i][1][0] = resizeValues[x][1];
                }
            }
        } else {// "x"
            // Snap Major axis
            for (let y in tileLayout[0]) {
                let resizeValues = resizeRow(List2D.getListX(y, tileLayout));
                for (let x in snapResize) {
                    snapResize[x][y][0][0] = resizeValues[x][0];
                    snapResize[x][y][1][0] = resizeValues[x][1];
                };
            }

            // Snap Minor axis
            let yList = Array(this.configStore.yMax).fill(false);
            for (let y in tileLayout[0]) {
                if(List2D.getListX(y, tileLayout).some(item => item === true)) {
                    yList[y] = true;
                }
            }
            let resizeValues = resizeRow(yList);
            for (let y in snapResize[0]) {
                for (let i = 0; i < snapResize.length; i++) {
                    snapResize[i][y][0][1] = resizeValues[y][0];
                    snapResize[i][y][1][1] = resizeValues[y][1];
                }
            }
        }

        /**
         *  NEW CODE
         */


        // Make useful Vars


        let gridStyles = {
            transition : this.config.transition,
            backgroundColor : "rgba(0, 0, 0, 0)",
            borderColor : "rgba(0, 0, 0, 0)",
            display : "grid",

            left : "0%",
            top : "0%",
            width : "100%",
            height : "100%",
        };

        // distance from 0,0
        let tileDistanceX = [0];
        for (let i = 0; i < this.config.tilePercentageX.length; i++) {
            tileDistanceX.push(tileDistanceX[i] + this.config.tilePercentageX[i]);
        }
        if (tileDistanceX[tileDistanceX.length - 1] !== 100) {
            console.warn("the total of tilePercentageX is not 100 meaning tileWin will ether overflow or underflow");
        }
        let tileDistanceY = [0];
        for (let i = 0; i < this.config.tilePercentageY.length; i++) {
            tileDistanceY.push(tileDistanceY[i] + this.config.tilePercentageY[i]);
        }
        if (tileDistanceY[tileDistanceX.length - 1] !== 100) {
            console.warn("the total of tilePercentageY is not 100 meaning tileWin will ether overflow or underflow");
        }
        

        // grid templates
        let columnTemplate = this.config.tilePercentageX.map(percentage => `${percentage/2}% ${percentage/2}%`).join(" ");
        let rowTemplate = this.config.tilePercentageY.map(percentage => `${percentage/2}% ${percentage/2}%`).join(" ");


        // Grid init


        // has parent
        let parent = document.querySelector(this.config.parent);
        if (!parent) {
            console.error("parent not found");
            return;
        }

        // make scroll
        let scrollGrid = parent.querySelector("#scrollGrid");
        if (!scrollGrid) {
            scrollGrid = document.createElement("div");
            scrollGrid.id = "scrollGrid";
            Style.style(scrollGrid, gridStyles);
            scrollGrid.style.position = "absolute";
            parent.appendChild(scrollGrid);
        }

        if (this.config.tileDirection === "y") {
            scrollGrid.style.gridTemplateColumns = columnTemplate;
            scrollGrid.style.gridTemplateRows = this.config.tilePercentageY.map(percentage => "auto auto").join(" ");
            scrollGrid.style.height = "auto";
        } else {
            scrollGrid.style.gridTemplateColumns = this.config.tilePercentageX.map(percentage => "auto auto").join(" ");
            scrollGrid.style.gridTemplateRows = rowTemplate;
            scrollGrid.style.width = "auto";
        }

        // make fixed
        let getFixedGrid = (number) => {
            let regex = new RegExp(`fixedGrid.*?${number.toString()}`);
            let elementParent = document.querySelector(this.config.parent);
            
            // Convert children HTMLCollection to an array to use find()
            let matchingElement = Array.from(elementParent.children).find(div => regex.test(div.id));
        
            if (matchingElement) {
                return matchingElement;
            } else {
                console.warn('No element found with that number.');
            }
        }
        function getFixedGridValues(id) {
            return JSON.parse(`[${id.replace("fixedGrid", "")}]`);
        }
        function normalizePercentages(percentages) {
            let total = percentages.reduce((acc, percent) => acc + percent, 0);
            let normalized = percentages.map(percent => (percent / total) * 100);
        
            return normalized;
        }

        for (let i in this.config.tileRowType) {
            if (this.config.tileRowType[i] !== "fixed") {
                continue;
            }
            let fixedGrid;
            if (this.config.tileRowType[i-1] !== "fixed") {
                fixedGrid = getFixedGrid(i);
                if (!fixedGrid) {
                    fixedGrid = document.createElement("div");
                    fixedGrid.id = `fixedGrid${i}`;
                    Style.style(fixedGrid, gridStyles);
                    fixedGrid.style.position = "fixed";
                    parent.appendChild(fixedGrid);
                }

                if (this.config.tileDirection === "y") {
                    fixedGrid.style.gridTemplateColumns = "50% 50%";
                    fixedGrid.style.gridTemplateRows = rowTemplate;
    
                    fixedGrid.style.left = `${tileDistanceX[i]}%`;
                    fixedGrid.style.width = `${this.config.tilePercentageX[i]}%`;
                } else {
                    fixedGrid.style.gridTemplateColumns = columnTemplate;
                    fixedGrid.style.gridTemplateRows = "50% 50%";
    
                    fixedGrid.style.top = `${tileDistanceY[i]}%`;
                    fixedGrid.style.height = `${this.config.tilePercentageY[i]}%`;
                }
            } else {
                fixedGrid = getFixedGrid(i-1);
                fixedGrid.id += `, ${i}`;

                let fixedLineID = getFixedGridValues(fixedGrid.id);
                let fixedLine = [];
                for (let i of fixedLineID) {
                    if (this.config.tileDirection === "y") {
                        fixedLine.push(this.config.tilePercentageX[i]);
                    } else {
                        fixedLine.push(this.config.tilePercentageY[i]);
                    }
                }
                fixedLine = normalizePercentages(fixedLine);

                let lineTemplate = fixedLine.map(percentage => `${percentage/2}% ${percentage/2}%`).join(" ");

                if (this.config.tileDirection === "y") {
                    fixedGrid.style.gridTemplateColumns = lineTemplate;
    
                    fixedGrid.style.width = `calc(${this.config.tilePercentageX[i]}% + ${fixedGrid.style.width})`;
                } else {
                    fixedGrid.style.gridTemplateRows = lineTemplate;

                    fixedGrid.style.height = `calc(${this.config.tilePercentagey[i]}% + ${fixedGrid.style.height})`;
                }
            }
        }

        // Make tiles
        for (let i in this.tiles) {
            let tile = this.tiles[i];

            let tileElement = document.getElementById(`tile${tile.id}`);
            
            if (!tileElement) {
                tileElement = document.createElement("div");
                tileElement.id = `tile${tile.id}`;
                if (this.config.tileRowType[tile[`${this.configStore.tileOppositeDirection}Snap`]] === "fixed") {
                    getFixedGrid(tile[`${this.configStore.tileOppositeDirection}Snap`]).appendChild(tileElement);
                } else {
                    scrollGrid.appendChild(tileElement);
                }
            }
            
            Style.style(tileElement, this.tileStyle);
                
            tileElement.style.gridColumnStart = snapResize[tile.xSnap][tile.ySnap][0][0] * 2 + 1;
            tileElement.style.gridColumnEnd = snapResize[tile.xSnap][tile.ySnap][1][0] * 2 + 1;

            tileElement.style.gridRowStart = snapResize[tile.xSnap][tile.ySnap][0][1] * 2 + 1;
            tileElement.style.gridRowEnd = snapResize[tile.xSnap][tile.ySnap][1][1] * 2 + 1;
            
            if (tile.content) {
                Tile.remove(`tile${tile.id}`);
                Tile.append(`tile${tile.id}`, tile.content);
            }
        }
    }


    append(name, content) {
        if (content === null) {
            return;
        }
        if (Array.isArray(content) === false) {
            content = [content];
        }
        for (let tile of this.tiles) {
            if (tile.name === name) {
                tile.status = "contentChanged";
                tile.content = tile.content.concat(content);
            }
        }
    }
    remove(name) {
        for (let tile of this.tiles) {
            if (tile.name === name) {
                tile.status = "contentChanged";
                tile.content = [];
            }
        }
    }
}