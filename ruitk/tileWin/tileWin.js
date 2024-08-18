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
        }
        this.updateConfig(); // run to make this.configStore
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
            cleanScrollAnimationFix : true
        }
        this.configStore.tileOppositeDirection = this.config.tileDirection === "y" ? "x" : "y";

        return;
    }

    updateStyle(style = {}) {
        style = Merge.dicts(this.style, style, [0, "", [], null]);
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
        let scrollRowMangerStyles = {
            transition : this.config.transition,
            backgroundColor : "rgba(0, 0, 0, 0)",
            borderColor : "rgba(0, 0, 0, 0)",
            position : "absolute",
            display : "flex",
            flexWrap : "wrap",
        };
        let holderBoxStyles = {
            backgroundColor : "rgba(0, 0, 0, 0)",
            borderColor : "rgba(0, 0, 0, 0)",
            position : "relative",
        }; 
        
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
                if (t.configStore.cleanScrollAnimationFix === true && t.config.animateOnCreateTile === true) {
                    ({ wInner, hInner } = calcWInnerAndHInner(tile, "100%", "100%", t));
                    Tile.create(`tileP${id}`, x, y, w, h, holderBoxStyles, p);
                    Tile.create(`tile${id}`, 0, 0, wInner, hInner, t.scrollTileStyle, `#tileP${id}`);
                } else {
                    Tile.create(`tile${id}`, x, y, wInner, hInner, t.scrollTileStyle, p);
                }
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
        function calcSnapValues(tile) {
            let xSnap = tileDistanceX[Math.floor(snapResize[tile.xSnap][tile.ySnap][0][0])] +
                (tilePercentageX[Math.floor(snapResize[tile.xSnap][tile.ySnap][0][0])] * (snapResize[tile.xSnap][tile.ySnap][0][0] % 1));
            let ySnap = tileDistanceY[Math.floor(snapResize[tile.xSnap][tile.ySnap][0][1])] +
                (tilePercentageY[Math.floor(snapResize[tile.xSnap][tile.ySnap][0][1])] * (snapResize[tile.xSnap][tile.ySnap][0][1] % 1));
            let wSnap = (tileDistanceX[Math.floor(snapResize[tile.xSnap][tile.ySnap][1][0])] +
                (tilePercentageX[Math.floor(snapResize[tile.xSnap][tile.ySnap][1][0])] * (snapResize[tile.xSnap][tile.ySnap][1][0] % 1))) - xSnap;
            let hSnap = (tileDistanceX[Math.floor(snapResize[tile.xSnap][tile.ySnap][1][1])] +
                (tilePercentageX[Math.floor(snapResize[tile.xSnap][tile.ySnap][1][1])] * (snapResize[tile.xSnap][tile.ySnap][1][1] % 1))) - ySnap;
        
            return { xSnap, ySnap, wSnap, hSnap };
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
         * The tilePercentageX & Y values and tileDistanceX & Y[-1] = 100 are necessary for calculating wSnap and hSnap.
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

            let { xSnap, ySnap, wSnap, hSnap } = calcSnapValues(tile);

            tile.x = xSnap + (wSnap * tile.snapShare[0][0]); // snapShare is for applying nudge to tiles
            tile.y = ySnap + (hSnap * tile.snapShare[0][1]); // snapShare is relative value therefore the Snap vars just need to state how big the snap should be

            tile.w = wSnap * (tile.snapShare[1][0] - tile.snapShare[0][0]);
            tile.h = hSnap * (tile.snapShare[1][1] - tile.snapShare[0][1]);
        }

        // need better fix than this for scroll tile ordering as this only works when all scroll tiles are all rendered in the same update func call
        this.tiles = this.tiles.sort((a, b) => {
            return a[`${this.config.tileDirection}`] - b[`${this.config.tileDirection}`];
        });

        for (let i in this.tiles) {
            let tile = this.tiles[i];

            let { xSnap, ySnap, wSnap, hSnap } = calcSnapValues(tile);

            if (tile.status === "unrendered") {
                if (this.config.tileRowType[tile[`${this.configStore.tileOppositeDirection}Snap`]] === "fixed") {
                    makeTile(tile, tile.id, `${tile.x}%`, `${tile.y}%`, `${tile.w}%`, `${tile.h}%`, this.config.parent, tile.content, this);
                } else {
                    // create row manager
                    if (document.querySelector(`#ScrollRowManger${tile[`${this.configStore.tileOppositeDirection}Snap`]}`) === undefined || document.querySelector(`#ScrollRowManger${tile[`${this.configStore.tileOppositeDirection}Snap`]}`) === null) {
                        if (this.configStore.tileOppositeDirection === "x") {
                            Tile.create(`ScrollRowManger${tile[`${this.configStore.tileOppositeDirection}Snap`]}`, `${xSnap}%`, 0, `${wSnap}%`, "auto", scrollRowMangerStyles, this.config.parent);
                        } else {
                            Tile.create(`ScrollRowManger${tile[`${this.configStore.tileOppositeDirection}Snap`]}`, 0, `${ySnap}%`, "auto", `${hSnap}%`, scrollRowMangerStyles, this.config.parent);
                        }
                    }
                    if (this.configStore.tileOppositeDirection === "x") {
                        makeTile(tile, tile.id, "0%", "0%", `${(tile.snapShare[1][0] - tile.snapShare[0][0])*100}%`, "auto", `#ScrollRowManger${tile[`${this.configStore.tileOppositeDirection}Snap`]}`, tile.content, this);
                    } else {
                        makeTile(tile, tile.id, "0%", "0%", "auto", `${(tile.snapShare[1][0] - tile.snapShare[0][0])*100}%`, `#ScrollRowManger${tile[`${this.configStore.tileOppositeDirection}Snap`]}`, tile.content, this);
                    }
                }
                tile.status = "rendered";
            } else {
                if (this.config.tileRowType[tile[`${this.configStore.tileOppositeDirection}Snap`]] === "fixed") {

                    let { wInner, hInner } = calcWInnerAndHInner(tile, `${tile.w}%`, `${tile.h}%`, this);
                    
                    Tile.transform(`tile${tile.id}`, `${tile.x}%`, `${tile.y}%`, wInner, hInner);
                }
                if (tile.status === "contentChanged") {
                    Tile.remove(`tile${tile.id}`);
                    Tile.append(`tile${tile.id}`, tile.content);
                }
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