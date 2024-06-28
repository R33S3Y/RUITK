import { Tile } from "./support/tile.js";
import { List2D } from "./support/list2D.js";
import { Merge } from "./support/merger.js";
import { Style } from "./support/style.js";

export class TileWin {
    constructor() {
        this.tiles = [];

        this.idCounter = 0;

        this.tileStyle = {};
        this.config = {
            tileMethod : "ticTacToe",
            tileNudgeFirst : "y",
            tileNudgeSwap : true,
            tileSnapFirst : "y",
            tileGap : "0",
            compensateForBorders : true,
            parent : "body"
        }
    }

    updateConfig(config = {}) {
        config = Merge.dicts(this.config, config, [0, "", [], null]);

        this.config = config;
        return;
    }

    updateStyle(style = {}) {
        style = Merge.dicts(this.style, style, [0, "", [], null]);
        style.position = "absolute";
        this.tileStyle = style;
        return;
    }

    createTile(name, xSnap, xNudge, ySnap, yNudge, content = null) {

        for (let tile of this.tiles) {
            if (tile.name === name) {
                console.error(`tile name ${name} is already in use by tile id ${tile.id}`);
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

    renderTiles() {
        
        let locMap = { // needed as a const to translate str to int
            left : 0,
            top : 0,
            centre : 1,
            right : 2,
            bottom : 2
        }

        let insideStyles = {
            transition : this.tileStyle.transition,
            backgroundColor : "rgba(0, 0, 0, 0)",
            borderColor : "rgba(0, 0, 0, 0)",
            position : "absolute",
            overflow : "visible"
        }

        let tileLayout = List2D.create(3, 3, false);
        let tileLayoutLength = List2D.create(3, 3, 0);
        // add items to layout
        for (let tile of this.tiles) {
            tileLayout[locMap[tile.xSnap]][locMap[tile.ySnap]] = true;
            tileLayoutLength[locMap[tile.xSnap]][locMap[tile.ySnap]]++;
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

        if (this.config.tileSnapFirst === "y") {
            // Snap Major axis
            for (let x in tileLayout) {
                let resizeValues = resizeRow(List2D.getListY(x, tileLayout));
                for (let y in snapResize[x]) {
                    snapResize[x][y][0][1] = resizeValues[y][0];
                    snapResize[x][y][1][1] = resizeValues[y][1];
                };
            }

            // Snap Minor axis
            let xList = Array(3).fill(false);
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
            let yList = Array(3).fill(false);
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
        // Make tiles

        for (let x = 0; x < tileLayoutLength.length; x++) {
            for (let y = 0; y < tileLayoutLength[x].length; y++) {
                if (tileLayoutLength[x][y] <= 1) {
                    continue;
                }
        
                let overLappingTiles = [];
                for (let i in this.tiles) {
                    let tile = this.tiles[i];
                    if (locMap[tile.xSnap] === x && locMap[tile.ySnap] === y) {
                        overLappingTiles.push(tile);
                    }
                }
        
                let currentSplit = this.config.tileNudgeFirst;
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
        
                    if (this.config.tileNudgeSwap === true) {
                        currentSplit = currentSplit === "y" ? "x" : "y";
                    }
                }
            }
        }
        console.debug(this.tiles);
        for (let i in this.tiles) {
            let tile = this.tiles[i];

            let xSnap = snapResize[locMap[tile.xSnap]][locMap[tile.ySnap]][0][0]*100/3;
            let ySnap = snapResize[locMap[tile.xSnap]][locMap[tile.ySnap]][0][1]*100/3;

            let wSnap = (snapResize[locMap[tile.xSnap]][locMap[tile.ySnap]][1][0]-snapResize[locMap[tile.xSnap]][locMap[tile.ySnap]][0][0])*100/3;
            let hSnap = (snapResize[locMap[tile.xSnap]][locMap[tile.ySnap]][1][1]-snapResize[locMap[tile.xSnap]][locMap[tile.ySnap]][0][1])*100/3;

            tile.x = xSnap + (wSnap * tile.snapShare[0][0]);
            tile.y = ySnap + (hSnap * tile.snapShare[0][1]);

            tile.w = wSnap * (tile.snapShare[1][0] - tile.snapShare[0][0]);
            tile.h = hSnap * (tile.snapShare[1][1] - tile.snapShare[0][1]);

            if (tile.status === "unrendered") {

                Tile.create(`tileP${tile.id}`, `${tile.x + (tile.w/2)}%`, `${tile.y + (tile.h/2)}%`, 0, 0, insideStyles, this.config.parent);
                if (this.config.compensateForBorders === true) {
                    Tile.create(
                        `tile${tile.id}`, // id 
                        this.config.tileGap, this.config.tileGap, //x,y
                        `calc(100% - ((${this.config.tileGap} * 2) + (${Style.query("borderLeftWidth", this.tileStyle)} + ${Style.query("borderRightWidth", this.tileStyle)})))`, // w
                        `calc(100% - ((${this.config.tileGap} * 2) + (${Style.query("borderTopWidth", this.tileStyle)} + ${Style.query("borderBottomWidth", this.tileStyle)})))`, // h
                        this.tileStyle, `#tileP${tile.id}`// style, p
                    );
                } else {
                    Tile.create(`tile${tile.id}`, this.config.tileGap, this.config.tileGap, `calc(100% - (${this.config.tileGap} * 2))`, `calc(100% - (${this.config.tileGap} * 2))`, this.tileStyle, `#tileP${tile.id}`);
                }
                if (tile.content !== null) {
                    Tile.append(`tile${tile.id}`, tile.content);
                }
                setTimeout(() => {
                    Tile.transform(`tileP${tile.id}`, `${tile.x}%`, `${tile.y}%`, `${tile.w}%`, `${tile.h}%`);
                }, 0);

                tile.status = "rendered";
            } else {
                Tile.transform(`tileP${tile.id}`, `${tile.x}%`, `${tile.y}%`, `${tile.w}%`, `${tile.h}%`);
            }
        }
    }
}