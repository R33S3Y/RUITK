
import { Merge } from "../../support/merger.js";
import { Style } from "../../support/style.js";
import { Tile } from "../../support/tile.js";
import { List2D } from "../../support/list2D.js";


let elements = [
    { // background Img
        name : "backgroundImg",
        function : (info, element) => {
            info = Merge.dicts({
                id : `${element.name}-${element.elementCount}`, // id
                img : "/ruitk/themes/fallen/wallpaper.jpg",
            }, info);

            let img = document.createElement("img");
            img.id = info.id;
            img.src = info.img;

            return img;
        },
        style : {
            position : "fixed",
            left : "0px",
            top : "0px",
            width : "100%",
            height : "100%",
            objectFit : "cover",
            zIndex : "-1",
        }
    }, { // tile
        name : "tile",
        function : (info, element) => {
            info = Merge.dicts({
                id: `innerTile-${element.elementCount}`, // id 
                outerTileId : `outerTile-${element.elementCount}`,
                content: "",
            }, info);

            let outerTile = document.createElement("div");
            outerTile.id = info.outerTileId;
            
            outerTile.style.left = "0%";
            outerTile.style.top = "0%";
            outerTile.style.width = `calc(100% - (${Style.query("marginLeft", element.style.outerTile)} + ${Style.query("marginRight", element.style.outerTile)}))`;
            outerTile.style.height = `calc(100% - (${Style.query("marginTop", element.style.outerTile)} + ${Style.query("marginBottom", element.style.outerTile)}))`;

            Style.style(outerTile, element.style.outerTile);

            let innerTile = document.createElement("div");
            outerTile.appendChild(innerTile);
            innerTile.id = info.id;
            
            // Check for string content properly
            if (info.content) {
                if(Array.isArray(info.content) === false) {
                    info.content = [info.content];
                }
                for (let item of info.content) {
                    if (typeof item === "string") {
                        innerTile.innerHTML += item; 
                    } else if (item instanceof HTMLElement) {
                        innerTile.appendChild(item); 
                    }
                }
            }
            
            innerTile.style.left = "0%";
            innerTile.style.top = "0%";
            innerTile.style.width = "100%";
            innerTile.style.height = "100%";

            Style.style(innerTile, element.style.innerTile);

            return outerTile;
        },
        style : {
            outerTile : {
                transition: "var(--transition)",
                overflow : "hidden",
                position : "relative",
                boxSizing : "border-box",
                margin : "10px",
                padding : "0px",

                // background
                backdropFilter: "blur(2px)",
                hover_backdropFilter: "blur(10px)",
                
                // border
                borderStyle : "solid",
                borderWidth : "3px",
                borderRadius : "15px",
                borderColor : "var(--accent1)",
                boxShadow: "0 0 4px rgba(0, 0, 0, 1)",
                hover_boxShadow: "0 0 15px 2px rgba(0, 0, 0, 1)",
                hover_borderColor : "var(--accent2)",
            },
            innerTile : {
                transition: "var(--transition)",
                position : "relative",
                overflow : "hidden",
                boxSizing : "border-box",
                margin : "0px",
                padding : "10px",

                // opacity
                opacity : "0.45",
                hover_opacity : "0.75",
                
                // background
                backgroundColor : "var(--background0)",
                hover_backgroundColor : "var(--background1)",

                // border
                borderStyle : "solid",
                borderWidth : "0px",
                borderRadius : "0px",
            },
        },
        handleStyle : true,
    }, {
        name : "tileWin",
        function : (info, element) => {
            info = Merge.dicts({
                config : {},
                style : {},
                tiles : [],
                disableTileElement : false,
            }, info);

            let tileWin = new TileWin();

            tileWin.updateConfig(info.config);
            tileWin.updateStyle(info.style);

            for (let tile of info.tiles) {
                let content = tile.content;
                if (info.disableTileElement === false) {
                    let elementStr = `<tile>{"content" : "${JSON.stringify(tile.content)}"}`;
                    console.debug(elementStr);
                    //content = element.makeElements(elementStr);
                }
                tileWin.createTile(tile.name, tile.x, tile.y, tile.content);
            }
            return 
        },
        style : {
            
        },
        handleStyle : true,
    }
];

export class FallenTileWin {
    static getElements() {
        return elements;
    }
}

class TileWin {
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
            tileOppositeDirection : this.config.tileDirection,
            xMax : this.config.tilePercentageX.length,
            yMax : this.config.tilePercentageY.length,
        }
        this.configStore.tileOppositeDirection = this.config.tileDirection === "y" ? "x" : "y";

        return;
    }

    updateStyle(style = {}) {
        style = Merge.dicts(this.style, style, [0, "", [], null]);
        style.boxSizing = "border-box";
        style.position = "static";
        this.tileStyle = style;

        // needed for old update
        style = JSON.parse(JSON.stringify(style));
        style.position = "relative";
        
        this.scrollTileStyle = style;
        style = JSON.parse(JSON.stringify(style));
        style.position = "fixed";
        this.fixedTileStyle = style;
        return;
    }

    createTile(name, xSnap, ySnap, content = null) {
        for (let tile of this.tiles) {
            if (tile.name === name) {
                console.error(`tile name ${name} is already in use by tile id: ${tile.id}`);
                return;
            }
            if (tile.xSnap === xSnap && tile.ySnap === ySnap) {
                console.error(`tile ${name} is in the same location as ${tile.name} please change the x and/or y`);
                return;
            }
        }
        let newTile = {
            name : name,
            id : this.idCounter,
            status : "unrendered",
            destory : false,

            xSnap : xSnap,
            ySnap : ySnap,

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

        /**
         * The tilePercentageX & Y values and tileDistanceX & Y[-1] = 100 are necessary for calculating w and h.
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

        // Make tiles
        for (let i in this.tiles) {
            let tile = this.tiles[i];

            let tileElement = document.getElementById(`tile${tile.id}`);

            if (tile.destory === true) {
                if (tileElement) {
                    tileElement.remove();
                }
                this.tiles.splice(i, 1);
                continue;
            }
            
            if (!tileElement) {
                if (this.config.tileRowType[tile[`${this.configStore.tileOppositeDirection}Snap`]] === "fixed") { // make fixed
                    tile.x = tileDistanceX[Math.floor(snapResize[tile.xSnap][tile.ySnap][0][0])] +
                    (tilePercentageX[Math.floor(snapResize[tile.xSnap][tile.ySnap][0][0])] * (snapResize[tile.xSnap][tile.ySnap][0][0] % 1));
                    tile.y = tileDistanceY[Math.floor(snapResize[tile.xSnap][tile.ySnap][0][1])] +
                    (tilePercentageY[Math.floor(snapResize[tile.xSnap][tile.ySnap][0][1])] * (snapResize[tile.xSnap][tile.ySnap][0][1] % 1));

                    tile.w = (tileDistanceX[Math.floor(snapResize[tile.xSnap][tile.ySnap][1][0])] +
                    (tilePercentageX[Math.floor(snapResize[tile.xSnap][tile.ySnap][1][0])] * (snapResize[tile.xSnap][tile.ySnap][1][0] % 1))) - tile.x;
                    tile.h = (tileDistanceX[Math.floor(snapResize[tile.xSnap][tile.ySnap][1][1])] +
                    (tilePercentageX[Math.floor(snapResize[tile.xSnap][tile.ySnap][1][1])] * (snapResize[tile.xSnap][tile.ySnap][1][1] % 1))) - tile.y;

                    let x = `${tile.x}%`;
                    let y = `${tile.y}%`;

                    let w = `${tile.w}%`;
                    let h = `${tile.h}%`;

                    let wInner = `calc(${w} - (${Style.query("marginLeft", this.fixedTileStyle)} + ${Style.query("marginRight", this.fixedTileStyle)}))`;
                    let hInner = `calc(${h} - (${Style.query("marginTop", this.fixedTileStyle)} + ${Style.query("marginBottom", this.fixedTileStyle)}))`;
                        
                    Tile.create(`tile${tile.id}`, x, y, wInner, hInner, this.fixedTileStyle, this.config.parent);
                } else { // make scroll
                    tileElement = document.createElement("div");
                    tileElement.id = `tile${tile.id}`;

                    Style.style(tileElement, this.tileStyle);

                    tileElement.style.gridColumnStart = snapResize[tile.xSnap][tile.ySnap][0][0] * 2 + 1;
                    tileElement.style.gridColumnEnd = snapResize[tile.xSnap][tile.ySnap][1][0] * 2 + 1;

                    tileElement.style.gridRowStart = snapResize[tile.xSnap][tile.ySnap][0][1] * 2 + 1;
                    tileElement.style.gridRowEnd = snapResize[tile.xSnap][tile.ySnap][1][1] * 2 + 1;

                    scrollGrid.appendChild(tileElement);
                }
            }
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
    destory(name) {
        for (let tile of this.tiles) {
            if (tile.name === name) {
                tile.destory = true;
            }
        }
    }
    destoryAll() {
        for (let tile of this.tiles) {
            tile.destory = true;
        }
    }
}