
import { Merge } from "../../support/merger.js";
import { Style } from "../../support/style.js";
import { TileWin } from "../../tileWin/tileWin.js";


let elements = [
    { // background Img
        name : "backgroundImg",
        function : (info, element) => {
            info = Merge.dicts({
                id : `${element.name}-${element.elementCount}`, // id
                img : new URL('./wallpaper.jpg', import.meta.url).href,
                alt : "A background image of a girl falling into the abyss with a upsidedown city scape coming from the top of the image. Art by [Raphaela](https://www.instagram.com/fredyguy12_art/)"
            }, info);

            let img = document.createElement("img");
            img.id = info.id;
            img.src = info.img;
            img.alt = info.alt;

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
        },
        style_standard : "<base>",
    }, { // tile
        name : "tile",
        function : (info, element) => {
            info = Merge.dicts({
                id: `innerTile-${element.elementCount}`, // id 
                outerTileId : `outerTile-${element.elementCount}`,
                content: {},
            }, info);

            let outerTile = document.createElement("div");
            outerTile.id = info.outerTileId;
            
            let outerStyle = element.style.outerTile;
            outerStyle = Merge.dicts(outerStyle, element.style_standard, []);
            outerStyle = Merge.dicts(outerStyle, element.style_border, []);

            outerTile.style.left = "0%";
            outerTile.style.top = "0%";
            outerTile.style.width = `calc(100% - (${outerStyle.margin} * 2))`;
            outerTile.style.height = `calc(100% - (${outerStyle.margin} * 2))`;

            Style.style(outerTile, outerStyle);

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

            let innerStyle = element.style.innerTile;
            innerStyle = Merge.dicts(innerStyle, element.style_standard, []);

            Style.style(innerTile, innerStyle);

            return outerTile;
        },
        style : {
            outerTile : {
                margin : "var(--marginMedium)",
                padding : "0",

                // background
                backdropFilter: "blur(2px)",
                hover_backdropFilter: "blur(10px)",
            },
            innerTile : {
                margin : "0",
                padding : "var(--paddingMedium)",

                // opacity
                opacity : "0.55",
                hover_opacity : "0.75",
                
                // background
                backgroundColor : "var(--background0)",
                hover_backgroundColor : "var(--background1)",

                // border
                borderWidth : "0",
            },
        },
        style_standard : "<base>",
        style_border : "<base>",
        handleStyle : true,
    }, { // tilewin
        name : "tileWin",
        function : (info, element) => {
            info = Merge.dicts({
                config : "{}",
                style : "{}",
                tiles : "[]",
                disableTileElement : false,
            }, info);

            info.config = element.parse(info.config);
            info.style = element.parse(info.style);
            info.tiles = element.parse(info.tiles, true);

            let tileWin = new TileWin();

            tileWin.updateConfig(info.config);
            tileWin.updateStyle(info.style);

            for (let tile of info.tiles) {

                tile = element.parse(tile, true);
                tile = Merge.dicts({
                    content : "",
                    name : "",
                    x : 0,
                    y : 0,
                }, tile);

                let content = tile.content;
                if (info.disableTileElement === false) {
                    let elementStr = `<tile>{"content" : ${tile.content}}`;
                    content = element.makeElements(elementStr);
                } else {
                    content = element.parse(tile.content);
                }
                tileWin.createTile(tile.name, tile.x, tile.y, content);
            }
            return tileWin.genrate();
        },
        style : {
            
        },
        handleStyle : true,
        parseLevel : 1,
    }
];

export class FallenTileWin {
    static getElements() {
        return elements;
    }
}
