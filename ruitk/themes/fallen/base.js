import { Merge } from "../../support/merger.js";
import { Style } from "../../support/style.js"; 
import { Tester } from "../../support/tester.js";

let colors = {
    background0: "rgba(0, 0, 0, 1)", // Default Background
    background1: "rgba(0, 0, 0, 1)", // Lighter (Focus / Hover) Background
    background2: "rgba(255, 240, 255, 1)", // Background for input boxes and the sort
    background3: "rgba(255, 210, 250, 1)", // Hover Background for input boxes and the sort

    accent1: "rgba(20, 1, 65, 1)", // border
    accent2: "rgba(40, 2, 130, 1)", // border active
    accent3: "rgba(20, 40, 250, 1)", // links
    
    accent4: "rgba(140, 100, 250, 1)", // underline
    accent5: "rgba(80, 50, 250, 1)", // bold
    accent6: "rgba(220, 100, 160, 1)", // italic

    standout1: "rgba(180, 100, 235, 1)", // h1
    standout2: "rgba(190, 120, 245, 1)", // h2
    standout3: "rgba(200, 160, 255, 1)", // h3
    standout4: "rgba(255, 240, 255, 1)", // p1
    standout5: "rgba(235, 220, 235, 1)", // p2
    standout6: "rgba(215, 200, 215, 1)", // p3
};


let config = { 
    transition : "all 0.2s ease-in-out",

    font : "ui-sans-serif,-apple-system,system-ui,Segoe UI,Helvetica,Apple Color Emoji,Arial,sans-serif,Segoe UI Emoji,Segoe UI Symbol",
       
    fontSizeH1 : 2.5,
    fontSizeH2 : 2.0,
    fontSizeH3 : 1.5,
    fontSizeP1 : 1.0,
    fontSizeP2 : 0.8,
    fontSizeP3 : 0.6,

    borderRadius : 1,
    borderWidth : 0.25,

    marginSmall : 0.2,
    paddingSmall : 0.2,

    marginMedium : 0.6,
    paddingMedium : 0.6,

    marginLarge : 1,
    paddingLarge : 1,
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
                xAlign : "",
                yAlign : "",
                textAlign : "left",
                position : "",
                element : element.element
            }, info);
        
            let e = document.createElement(info.element);
            delete info.element;
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

            e.style.position = "relative";
            
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
            if (info.xAlign !== "") {
                let xPercent = convert[info.xAlign];
                e.style.left = `${xPercent}%`;
                e.style.transform += `translateX(-${xPercent}%)`;
            }
            // Handle vertical alignment
            if (info.yAlign !== "") {
                let yPercent = convert[info.yAlign];
                e.style.top = `${yPercent}%`;
                e.style.transform += ` translateY(-${yPercent}%)`;
            }
            
            info = Merge.dicts({
                onClick: null,
                onEnter: null,
                onAny: null,
            }, info);

            Tester.dicts({
                onClick: ["function", "null"],
                onEnter: ["function", "null"],
                onAny: ["function", "null"],
            }, info, `${element.name} Element: `);

            if (info.onClick !== null) e.addEventListener("click", (event) => info.onClick(event));
            if (info.onEnter !== null) {
                function ifEnter(event, callback) {
                    if (event.key === "Enter") {
                        callback(event);
                    }
                }
                e.addEventListener("keydown", (event) => ifEnter(event, info.onEnter));
            }
            if (info.onAny !== null) {
                for (let key in window) {
                    if (key.startsWith("on")) {
                        let eventType = key.slice(2); // Remove "on" prefix
                        e.addEventListener(eventType, (event) => info.onAny(event));
                    }
                }
            }

            return e;
        },
        style_standard : {
            transition: "var(--transition)",
            fontFamily : "var(--font)",
            focus_outline : "3px solid var(--standout3)",
            fontSize : "var(--fontSizeP2)",
            position : "relative",
            overflow : "hidden",
            boxSizing : "border-box",
        },
        style_border : {
            border : "var(--borderWidth) solid var(--accent1)",
            borderRadius : "var(--borderRadius)",
            boxShadow: "0 0 4px rgba(0, 0, 0, 1)",
            hover_boxShadow: "0 0 15px 2px rgba(0, 0, 0, 1)",
            hover_borderColor : "var(--accent2)",
        },
        style_paddingNone : {
            margin : "0",
            padding : "0",
        },
        style_paddingSmall : {
            margin : "var(--marginSmall)",
            padding : "var(--paddingSmall)",
        },
        style_paddingMedium : {
            margin : "var(--marginMedium)",
            padding : "var(--paddingMedium)",
        },
        style_paddingLarge : {
            margin : "var(--marginLarge)",
            padding : "var(--paddingLarge)",
        },
    }, { // h1
        name : "h1",
        function : (info, element) => {
            
            let p = element.generate(info, element);

            return p;
        }, 
        generate : "<base>",
        style : {
            fontSize : "var(--fontSizeH1)",
            color : "var(--standout1)",
        },
        style_standard : "<base>",
        style_paddingSmall : "<base>",
        element : "h1"
    }, { // h2
        name : "h2",
        function : "<h1>", 
        generate : "<base>",
        style : {
            fontSize : "var(--fontSizeH2)",
            color : "var(--standout2)",
        },
        style_standard : "<base>",
        style_paddingSmall : "<base>",
        element : "h2"
    }, { // h3
        name : "h3",
        function : "<h1>", 
        generate : "<base>",
        style : {
            fontSize : "var(--fontSizeH3)",
            color : "var(--standout3)",
        },
        style_standard : "<base>",
        style_paddingSmall : "<base>",
        element : "h3"
    }, { // p1
        name : "p1",
        function : "<h1>", 
        generate : "<base>",
        style : {
            fontSize : "var(--fontSizeP1)",
            color : "var(--standout4)",
        },
        style_standard : "<base>",
        style_paddingSmall : "<base>",
        element : "p"
    }, { // p2
        name : "p2",
        function : "<h1>", 
        generate : "<base>",
        style : {
            fontSize : "var(--fontSizeP2)",
            color : "var(--standout5)",
        },
        style_standard : "<base>",
        style_paddingSmall : "<base>",
        element : "p"
    }, { // p3
        name : "p3",
        function : "<h1>", 
        generate : "<base>",
        style : {
            fontSize : "var(--fontSizeP3)",
            color : "var(--standout6)",
        },
        style_standard : "<base>",
        style_paddingSmall : "<base>",
        element : "p"
    }, { // b
        name : "b",
        function : "<h1>", 
        generate : "<base>",
        style : {
            fontSize: "inherit",
            color : "var(--accent5)",
        },
        style_standard : "<base>",
        style_paddingNone : "<base>",
        element : "b"
    }, { // i
        name : "i",
        function : "<h1>", 
        generate : "<base>",
        style : {
            fontSize: "inherit",
            color : "var(--accent6)",
        },
        style_standard : "<base>",
        style_paddingNone : "<base>",
        element : "i"
    }, { // u
        name : "u",
        function : "<h1>", 
        generate : "<base>",
        style : {
            fontSize: "inherit",
            color : "var(--accent4)",
        },
        style_standard : "<base>",
        style_paddingNone : "<base>",
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
            fontSize: "inherit",
            color : "var(--accent3)",
        },
        style_standard : "<base>",
        style_paddingNone : "<base>",
        element : "a"
    }, { // grid
        name : "grid",
        function : (info, element) => {
            info = Merge.dicts({
                rTemplate: "auto", // default row setting
                cTemplate: "auto", // default column setting
                gap: "0", // gap between rows and columns
                areas: "initial", // grid template areas (optional)
                justifyContent : "space-between",
            }, info);
    
            let grid = element.generate(info, element);

            // Apply grid-specific styles
            grid.style.display = "grid";
            grid.style.gridTemplateRows = info.rTemplate;
            grid.style.gridTemplateColumns = info.cTemplate;
            grid.style.gridGap = info.gap;

            grid.style.justifyContent = info.justifyContent;
    

            grid.style.gridTemplateAreas = info.areas;

    
            return grid;
        },
        generate : "<base>",
        style: {},
        style_standard : "<base>",
        element: "div"
    }
];

function init () {
    Style.declare(colors);
    let zoomer = () => {
        let hold = {};
        for (let key in config) {
            if (typeof config[key] === "number") {
                hold[key] = `${config[key] * window.devicePixelRatio}vw`;
                continue;
            };
            hold[key] = config[key];
        };
        Style.declare(hold);
    };
    zoomer();
    window.addEventListener('resize', zoomer);
}

export class FallenBase {
    static getElements() {
        init();
        return elements;
    }
}

