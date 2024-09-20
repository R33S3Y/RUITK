import { Merge } from "../../support/merger.js";
import { Style } from "../../support/style.js";

// color scheme syntax from https://github.com/chriskempson/base16/tree/main

let colors = {
    base00: "rgba(0, 0, 0, 1)", // Default Background
    base01: "rgba(0, 0, 0, 1)", // Lighter (Focus) Background
    base02: "rgba(20, 1, 65, 1)", // Background Accent
    base03: "rgba(40, 2, 130, 1)", // Lighter Background Accent

    base04: "", // Dark Foreground (Used for status bars)
    base05: "", // Default Foreground, Caret, Delimiters, Operators
    base06: "", // Light Foreground (Not often used)
    
    base07: "rgba(80, 50, 250, 1)", // underline
    base08: "rgba(80, 50, 250, 1)", // bold
    base09: "rgba(80, 50, 250, 1)", // italic

    base0A: "rgba(180, 100, 235, 1)", // h1
    base0B: "rgba(190, 120, 245, 1)", // h2
    base0C: "rgba(200, 160, 255, 1)", // h3
    base0D: "rgba(250, 200, 255, 1)", // p1
    base0E: "rgba(230, 180, 245, 1)", // p2
    base0F: "rgba(210, 160, 235, 1)", // p3
};


let config = {
    transition : "all 0.2s ease-in-out",

    font : "Arial, Helvetica, sans-serif",
    
    fontSizeH1 : "3.2em",
    fontSizeH2 : "2.5em",
    fontSizeH3 : "2em",
    fontSizeP1 : "1.5em",
    fontSizeP2 : "1em",
    fontSizeP3 : "0.75em",
};

let elements = [
    { // base
        name : "base",
        generate : (info, element) => {
            info = Merge.dicts({
                id: `${element.name}-${element.elementCount}`, // id 
                content: "",
                x : "",
                y : "",
                w : "auto",
                h : "auto",
                c : "",
                r : "",
                xAline : "",
                yAline : "",
                textAlign : "left",
                position : "",
            }, info);
        
            let e = document.createElement(element.element);
            e.id = info.id;
            
            e.style.textAlign = info.textAlign;
            
            // Check for string content properly
            if (info.content) {
                if(Array.isArray(info.content) === false) {
                    info.content = [info.content];
                }
                for (let item of info.content) {
                    if (typeof item === "string") {
                        e.innerHTML += item; 
                    } else if (item instanceof HTMLElement) {
                        e.appendChild(item); 
                    }
                }
            }


            if (info.x === "" && info.y === "" && info.xAline === "" && info.yAline === "" && info.w === "auto" && info.h === "auto" ) {// all defaults
                e.style.position = "relative";
            } else {
                e.style.position = "absolute";
            }
            if (info.position !== "") {
                e.style.position = info.position;
            }

            e.style.left = info.x;
            e.style.top = info.y;
            e.style.width = info.w;
            e.style.height = info.h;

            e.style.gridColumn = info.c;
            e.style.gridRow = info.r;

            let convert = {
                left: 0,
                top: 0,
                center: 50,
                right: 100,
                bottom: 100
            };
            // Handle horizontal alignment
            if (info.xAline !== "") {
                let xPercent = convert[info.xAline];
                e.style.left = `${xPercent}%`;
                e.style.transform += `translateX(-${xPercent}%)`;
            }
            // Handle vertical alignment
            if (info.yAline !== "") {
                let yPercent = convert[info.yAline];
                e.style.top = `${yPercent}%`;
                e.style.transform += ` translateY(-${yPercent}%)`;
            }
        
            return e;
        }
        ,
    }, { // h1
        name : "h1",
        function : (info, element) => {
            
            let p = element.generate(info, element);

            return p;
        }, 
        generate : "<base>",
        style : {
            padding : "10px",
            margin : "0",
            fontFamily : "var(--font)",
            fontSize : "var(--fontSizeH1)",
            color : "var(--base0A)",
        },
        element : "h1"
    }, { // h2
        name : "h2",
        function : "<h1>", 
        generate : "<base>",
        style : {
            padding : "10px",
            margin : "0",
            fontFamily : "var(--font)",
            fontSize : "var(--fontSizeH2)",
            color : "var(--base0B)",
        },
        element : "h2"
    }, { // h3
        name : "h3",
        function : "<h1>", 
        generate : "<base>",
        style : {
            padding : "10px",
            margin : "0",
            fontFamily : "var(--font)",
            fontSize : "var(--fontSizeH3)",
            color : "var(--base0C)",
        },
        element : "h3"
    }, { // p1
        name : "p1",
        function : "<h1>", 
        generate : "<base>",
        style : {
            padding : "10px",
            margin : "0",
            fontFamily : "var(--font)",
            fontSize : "var(--fontSizeP1)",
            color : "var(--base0D)",
        },
        element : "p"
    }, { // p2
        name : "p2",
        function : "<h1>", 
        generate : "<base>",
        style : {
            padding : "10px",
            margin : "0",
            fontFamily : "var(--font)",
            fontSize : "var(--fontSizeP2)",
            color : "var(--base0E)",
        },
        element : "p"
    }, { // p3
        name : "p3",
        function : "<h1>", 
        generate : "<base>",
        style : {
            padding : "10px",
            margin : "0",
            fontFamily : "var(--font)",
            fontSize : "var(--fontSizeP3)",
            color : "var(--base0F)",
        },
        element : "p"
    }, { // b
        name : "b",
        function : "<h1>", 
        generate : "<base>",
        style : {
            margin : "0",
            fontFamily : "var(--font)",
            color : "var(--base08)",
        },
        element : "b"
    }, { // i
        name : "i",
        function : "<h1>", 
        generate : "<base>",
        style : {
            margin : "0",
            fontFamily : "var(--font)",
            color : "var(--base09)",
        },
        element : "i"
    }, { // u
        name : "u",
        function : "<h1>", 
        generate : "<base>",
        style : {
            margin : "0",
            fontFamily : "var(--font)",
            color : "var(--base09)",
        },
        element : "u"
    }, { // a
        name : "a",
        function : (info, element) => {
            info = Merge.dicts({
                href : ""
            }, info);

            let p = element.generate(info, element);
            p.href = info.href;

            return p;
        }, 
        generate : "<base>",
        style : {
            margin : "0",
            fontFamily : "var(--font)",
            color : "var(--base09)",
        },
        element : "a"
    }, { // grid
        name : "grid",
        function : (info, element) => {
            info = Merge.dicts({
                r: "auto", // default row setting
                c: "auto", // default column setting
                gap: "0", // gap between rows and columns
                areas: "", // grid template areas (optional)
                j : "space-between",
            }, info);
    
            let grid = element.generate(info, element);

            // Remove the child element info
            grid.style.gridColumn = "";
            grid.style.gridRow = "";
    
            // Apply grid-specific styles
            grid.style.display = "grid";
            grid.style.gridTemplateRows = info.r;
            grid.style.gridTemplateColumns = info.c;
            grid.style.gridGap = info.gap;

            grid.style.justifyContent = info.j;
    
            if (info.areas !== "") {
                grid.style.gridTemplateAreas = info.areas;
            }
    
            return grid;
        },
        generate : "<base>",
        style: {},
        element: "div"
    }
];


export class FallenBase {
    static init () {
        Style.declare(colors);
        Style.declare(config);
    }
    static getElements() {
        return elements;
    }
}

