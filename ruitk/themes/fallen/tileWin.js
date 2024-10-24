
import { Merge } from "../../support/merger.js";
import { Style } from "../../support/style.js";
import { TileWin } from "../../tileWin/tileWin.js";


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
    }, { // tilewin
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
                    content = element.makeElements(elementStr);
                }
                tileWin.createTile(tile.name, tile.x, tile.y, tile.content);
            }
            return tileWin.genrate();
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
