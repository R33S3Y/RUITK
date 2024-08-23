import { Merge } from "../../support/merger.js";
import { Style } from "../../support/style.js";

// color scheme syntax from https://github.com/chriskempson/base16/tree/main
// V0 colors from https://github.com/gitmalet/base16-purpledream-scheme/tree/master
let colors = {
    base00: "rgba(8, 8, 8, 0.5)", // Default Background
    base01: "#FF0000", // Lighter Background (Used for status bars, line number and folding marks)
    base02: "rgba(0, 0, 0, 0.7)", // Selection / Focus Background The back ground for the thing there using
    base03: "#605060", // Comments, Invisibles, Line Highlighting
    base04: "#150141", // Dark Foreground (Used for status bars)
    base05: "#250282", // Default Foreground, Caret, Delimiters, Operators
    base06: "#eee0ee", // Light Foreground (Not often used)
    base07: "#fff0ff", // Light Background (Not often used)
    base08: "#FF1D0D", // Variables, XML Tags, Markup Link Text, Markup Lists, Diff Deleted
    base09: "#CCAE14", // Integers, Boolean, Constants, XML Attributes, Markup Link Url
    base0A: "rgba(120, 100, 128, 0.8)", // h1
    base0B: "rgba(87, 82, 108, 0.8)", // h2
    base0C: "rgba(87, 82, 108, 0.8)", // h3
    base0D: "#FDBBF2", // p1
    base0E: "rgba(87, 82, 108, 0.8)", // p2
    base0F: "rgba(87, 82, 108, 0.8)", // p3
};
let config = {
    transition : "all 0.2s ease-in-out",

    font : "Arial, Helvetica, sans-serif",
    
    fontSizeH1 : "1em",
    fontSizeH2 : "1em",
    fontSizeH3 : "1em",
    fontSizeP1 : "1em",
    fontSizeP2 : "1em",
    fontSizeP3 : "1em",
};
export class Theme {
    getTileWinStyle() {
        return {
            transition: "all 0.2s ease-in-out",
            position : "absolute",
            overflow : "hidden",
            boxSizing : "border-box",
            margin : "10px",
            padding : "10px",
            
            // background
            backgroundColor : colors.base00,
            hover_backgroundColor : colors.base02,
            backdropFilter: "blur(2px)",
            
            // border
            borderStyle : "solid",
            borderWidth : "3px",
            borderRadius : "15px",
            borderColor : colors.base04,
            boxShadow: "0 0 4px rgba(0, 0, 0, 1)",
            hover_boxShadow: "0 0 15px 2px rgba(0, 0, 0, 1)",
            hover_borderColor : colors.base05,
        };
    }
    getElements() {
        return [
            {
                name : "base",
                generate : (info, element) => {
                    info = Merge.dicts({
                        id : element.name, // id 
                        content : "",
                        x : "",
                        y : "",
                        w : "auto",
                        h : "auto",
                        xAline : "",
                        yAline : "",
                    }, info);
                    
                    let e = document.createElement(element.element);
                    if (typeof info.content === "String") {
                        e.innerText = info.content;
                    } else {
                        e.innerHTML = info.content;
                    }

                    e.style.left = info.x;
                    e.style.top = info.y;
                    e.style.width = info.w;
                    e.style.height = info.h;

                    let convert = {
                        left : 0,
                        top : 0,
                        center : 50,
                        right : 100,
                        bottom : 100
                    };
                    e.style.transform = "";
                    if (info.xAline !== "") {
                        let xPercent = convert[info.xAline];
                        e.style.left = `${xPercent}%`;
                        e.style.transform += `translateX(-${xPercent}%)`;
                    }
                    if (info.yAline !== "") {
                        let yPercent = convert[info.xAline];
                        e.style.top = `${yPercent}%`;
                        e.style.transform += ` translateY(-${yPercent}%)`;
                    }

                    return e;
                },
            }, {
                name : "p1",
                function : (info, element) => {
                    info = Merge.dicts({
                        id : element.name, // id 
                        text : "",
                        content : info.text,
                    }, info);

                    let p = element.generate(info, element);

                    return p;
                }, 
                generate : "<base>",
                style : {
                    padding : "10px",
                    margin : "0",
                    fontFamily : config.font,
                    fontSize : config.fontSizeP1,
                    color : colors.base0D,
                },
                element : "p"
            }
        ];
    }
}

