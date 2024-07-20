import { Merge } from "../../support/merger.js";
import { Style } from "../../support/style.js";

// color scheme syntax from https://github.com/chriskempson/base16/tree/main
// V0 colors from https://github.com/gitmalet/base16-purpledream-scheme/tree/master
let colors = {
    base00: "rgba(61, 61, 61, 0.5)", // Default Background
    base01: "rgba(70, 70, 70, 1)", // Lighter Background (Used for status bars, line number and folding marks)
    base02: "#403040", // Selection Background
    base03: "#605060", // Comments, Invisibles, Line Highlighting
    base04: "rgba(87, 82, 108, 0.8)", // Dark Foreground (Used for status bars)
    base05: "rgba(193, 143, 179, 1)", // Default Foreground, Caret, Delimiters, Operators
    base06: "#eee0ee", // Light Foreground (Not often used)
    base07: "#fff0ff", // Light Background (Not often used)
    base08: "#FF1D0D", // Variables, XML Tags, Markup Link Text, Markup Lists, Diff Deleted
    base09: "#CCAE14", // Integers, Boolean, Constants, XML Attributes, Markup Link Url
    base0A: "#F000A0", // Classes, Markup Bold, Search Text Background
    base0B: "#14CC64", // Strings, Inherited Class, Markup Code, Diff Inserted
    base0C: "#0075B0", // Support, Regular Expressions, Escape Characters, Markup Quotes
    base0D: "#00A0F0", // Functions, Methods, Attribute IDs, Headings
    base0E: "#B000D0", // Keywords, Storage, Selector, Markup Italic, Diff Changed
    base0F: "#6A2A3C", // Deprecated, Opening/Closing Embedded Language Tags, e.g. <?php ?>
};
let config = {
    transition : "all 0.2s ease-in-out",
    
    backgroundTile :{
        tileGap : "10px",
        compensateForBorders : true,
    }
};
export class Theme {
    getElements() {
        return [
            {
                name : "backgroundTile",
                function : (info, element) => {
                    info = Merge.dicts({
                        id : element.name, // id 
                        tileGap : config.backgroundTile.tileGap,
                        compensateForBorders : config.backgroundTile.compensateForBorders,
                    }, info);
        
                    let x = info.tileGap;
                    let y = info.tileGap;
                    let w;
                    let h;
        
                    if (info.compensateForBorders === true) {
                        w = `calc(100% - ((${info.tileGap} * 2) + (${Style.query("borderLeftWidth", element.style)} + ${Style.query("borderRightWidth", element.style)})))`;
                        h = `calc(100% - ((${info.tileGap} * 2) + (${Style.query("borderTopWidth", element.style)} + ${Style.query("borderBottomWidth", element.style)})))`;
                    } else {
                        w = `calc(100% - (${info.tileGap} * 2))`;
                        h = `calc(100% - (${info.tileGap} * 2))`;
                    }
        
                    let tile = document.createElement("div");
                    tile.id = info.id;
            
                    // sizing and pos
                    tile.style.left = x;
                    tile.style.top = y;
                    tile.style.width = w;
                    tile.style.height = h;
                    
                    return tile;
                },
                style : {
                    transition: config.transition,
                    position : "absolute",
                    overflow : "hidden",
                    zIndex : "-1", // breaks hover_

                    // background
                    backgroundColor : colors.base00,
                    backdropFilter: "blur(4px)",
                    
                    // border
                    borderStyle : "solid",
                    borderWidth : "3px",
                    borderRadius : "15px",
                    borderColor : colors.base04,
                    boxShadow: "0 0 5px 2px rgba(0, 0, 0, 1)",
                }
            }, {
                name : "text1",
                function : (info, element) => {
                    info = Merge.dicts({
                        id : element.name, // id 
                        text : "",
                    }, info);
                    
                    let p = document.createElement("p");
                    p.innerText = info.text;

                    return p
                },
                style : {
                    transition: config.transition,
                    color : colors.base04,
                }
            }
        ];
    }
}