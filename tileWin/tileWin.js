import { Tile } from "./support/tile.js";
import { List2D } from "./support/list2D.js";
import { Merge } from "./support/merger.js";

export class TileWin {
    constructor() {
        this.tiles = [];

        this.idCounter = 0;

        this.tileStyle = {};
        this.config = {
            tileMethod : "ticTacToe",
            tileNudge : "y",
            tileSnapFirst : "y",
        }
    }

    updateConfig(config = {}) {
        config = Merge.dicts(this.config, config);

        this.config = config;
        
        return;
    }

    createTile(name, xSnap, xNudge, ySnap, yNudge, content) {

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

            x : 0,
            y : 0,
            w : 0,
            h : 0,

            content : content
        };
        this.idCounter++;
        this.tiles.push(newTile);
    }

    initTiles(names) {
        
        let locMap = { // needed as a const to translate str to int
            left : 0,
            top : 0,
            centre : 1,
            right : 2,
            bottom : 2
        }

        let tileLayout = List2D.create(3, 3, false);
        // add items to layout
        for (let tile of this.tiles) {
            tileLayout[locMap[tile.xSnap]][locMap[tile.ySnap]] = true;
        }

        // [[x1,y1],[x2,y2]]
        let snapResize = List2D.create(3,3,[[0,0],[1,1]]);
        snapResize = JSON.parse(JSON.stringify(snapResize));
        
        // Snaps
        function resizeRow(itemTotals = []) {
            let itemSize = Array(itemTotals.length).fill([0,0]);
            itemSize = JSON.parse(JSON.stringify(itemSize));
            // default values
            for (let i = 0; i < itemTotals.length; i++) {
                itemSize[i][0] = i;
                itemSize[i][1] = i+1;
            }
            return itemSize;

        }

        // Rewrite start                                                                          <----
        // Snap Major axis
        for (let x in tileLayout) {
            let resizeValues = resizeRow(List2D.getListY(x, tileLayout));
            for (let y in snapResize[x]) {
                snapResize[x][y][0] = resizeValues[y];
            };
        }

        // Snap Minor axis
        let xList = Array(3).fill(false);
        for (let y in tileLayout[0]) {
            for (let x in tileLayout) {
                if (tileLayout[x][y] === true) {
                    xList[y] = true;
                    break;
                }
            }
        }
        let resizeValues = resizeRow(xList);
        for (let x in snapResize) {
            for (let i = 0; i < snapResize[x].length; i++) {
                snapResize[x][i][1] = resizeValues[x];
            }
        }
        // Rewrite stop                                                                           <----

        // Make tiles
        for (let i in this.tiles) {
            let tile = this.tiles[i];
            if (tile.status === "unrendered") {

                tile.x = snapResize[locMap[tile.xSnap]][locMap[tile.ySnap]][0][0]*100/3;
                tile.y = snapResize[locMap[tile.xSnap]][locMap[tile.ySnap]][0][1]*100/3;

                tile.w = (snapResize[locMap[tile.xSnap]][locMap[tile.ySnap]][1][0]-snapResize[locMap[tile.xSnap]][locMap[tile.ySnap]][0][0])*100/3;
                tile.h = (snapResize[locMap[tile.xSnap]][locMap[tile.ySnap]][1][1]-snapResize[locMap[tile.xSnap]][locMap[tile.ySnap]][0][1])*100/3;

                Tile.create(tile.id, `${tile.x + (tile.w/2)}%`, `${tile.y + (tile.h/2)}%`, 0, 0, this.tileStyle);
                setTimeout(() => {
                    Tile.transform(tile.id, `${tile.x}%`, `${tile.y}%`, `${tile.w}%`, `${tile.h}%`);
                }, 0);

                tile.status = "rendered";
            }
        }


        /**
        // 0. init func
        function updateSnapDead(snapDead, tileLayout, x, y, direction) {
            if (direction === "x") {
                for (let i = x + 1; i < 3; i++) { // 1 less than 3 as do not need to check self
                    if (tileLayout[i][y].length > 0) { // if snap being tested is live, stop
                        break;
                    }
                    snapDead[i][y]++;
                }
                for (let i = x - 1; i >= 0; i--) {
                    if (tileLayout[i][y].length > 0) { // if snap being tested is live, stop
                        break;
                    }
                    snapDead[i][y]++;
                }
            } else { // direction === "y"
                for (let i = y + 1; i < 3; i++) { // 1 less than 3 as do not need to check self
                    if (tileLayout[x][i].length > 0) { // if snap being tested is live, stop
                        break;
                    }
                    snapDead[x][i]++;
                }
                for (let i = y - 1; i >= 0; i--) {
                    if (tileLayout[x][i].length > 0) { // if snap being tested is live, stop
                        break;
                    }
                    snapDead[x][i]++;
                }
            }
        }
        // 1. let all live snaps call dibs on dead snaps
        for (let x in snapDead) {
            for (let y in snapDead[x]) {
                if (tileLayout[x][y].length > 0) { // snap is live
                    snapDead[x][y] = -1; // mark snap as live (should be unneeded)
        
                    if (this.config.tileSnap === "x") {
                        updateSnapDead(snapDead, tileLayout, parseInt(x), parseInt(y), "x");
                    } else { // tileSnap is "y"
                        updateSnapDead(snapDead, tileLayout, parseInt(x), parseInt(y), "y");
                    }
                }
            }
        }

        // 2. expand snaps
        for (let x in snapDead) {
            for (let y in snapDead[x]) {
                if (tileLayout[x][y].length > 0) { // snap is live
                    snapDead[x][y] = -1; // mark snap as live (should be unneeded)
        
                    if (this.config.tileSnap === "x") {
                        
                        
                    } else { // tileSnap is "y"
                        
                        
                    }
                }
            }
        }
        

        // Nudges

        // 1. sort by nudge
        for (let x in tileLayout) {
            for (let y in tileLayout[x]) {
                tileLayout[x][y].sort((a, b) => a[`${this.config.tileNudge}Nudge`] - b[`${this.config.tileNudge}Nudge`]);
            }
        }
        */
    }
}