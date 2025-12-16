import { Merge } from "../../support/merger.js";
import { Style } from "../../support/style.js";
import { Convert } from "../../support/convert.js";
import { Tester } from "../../support/tester.js";

let elements = [
    {    // search
        name: "search",
        function: (info, element) => {
            info = Merge.dicts({
                id : `"${element.name}-${element.elementCount}"`,
                callback : `(value) => {console.warn("search Element: missing callback function")}`,
            }, info);

            Tester.dicts({
                id : { type: "string", full: true },
                callback : { type: "string", full: true },
            }, info, `${element.name} Element: `);

            let textboxInfo = JSON.parse(JSON.stringify(info));


            let textboxInfoStr = "";
            for (let key in textboxInfo) {
                textboxInfoStr += `${key} : ${textboxInfo[key]}, `;
            }

            let e = element.makeElements(`<textbox>{${textboxInfoStr}}`);

            info.callback = element.parse(info.callback);

            function handleKeyDown(event, callback) {
                if (event.key === "Enter") {
                    event.preventDefault(); // Prevents new lines in multi-line inputs
            
                    const input = event.target;
                    const lastValue = input.dataset.lastValue || "";
            
                    if (input.value !== lastValue) {
                        input.dataset.lastValue = input.value; // Update stored value
                        callback(input.value);
                    }
                }
            }
            e.addEventListener("keydown", (event) => handleKeyDown(event, info.callback));
            
            let icon = element.makeElements(`<icon>{name : "editFind", color : "var(--accent1)",
            hover_color : "var(--accent2)", size : "var(--fontSizeH2)", c : 2, r : 2}`);
            function handleClick(callback) {
                const input = document.getElementById(element.parse(info.id));
                const lastValue = input.dataset.lastValue || "";
            
                if (input.value !== lastValue) {
                    input.dataset.lastValue = input.value; // Update stored value
                    callback(input.value);
                }
            }
            icon.addEventListener("click", () => handleClick(info.callback));

            e.appendChild(icon);

            return e;
        },
        style: {
        
        },
        style_standard : "<base>",
        parseLevel : 1, 
    }, { // icon
        name: "icon",
        function: (info, element) => {
            info = Merge.dicts({
                name: "globe", // Default icon name
                size: "var(--fontSizeP1)",  // Default size
                color: "var(--standout4)", // Default color
            }, info);

            info = Merge.dicts({
                hoverColor : info.color,
            }, info);

            Tester.dicts({
                name : { type: "string", full: true },
                size : { type: "string", full: true },
                color : { type: "string", full: true },
                hoverColor : { type: "string", full: true },
            }, info, `${element.name} Element: `);
            
            Style.fontFace({
                fontFamily : "icons",
                src : `url("https://cdn.kde.org/breeze-icons/icons.woff2") format("woff2");
                    url("https://cdn.kde.org/breeze-icons/icons.tff") format("truetype");
                    url("https://cdn.kde.org/breeze-icons/icons.svg") format("svg")`,
                fontWeight : "normal",
                fontStyle : "normal",
            });
    
            let e = element.generate(info, element);
            e.innerHTML = Convert.convert(info.name, "dashedCase")
            e.style.fontSize = info.size;
            e = Style.style(e, [{color : info.color, hover_color : info.hoverColor}, element.style, element.style_standard, element.style_paddingSmall]);
    
            return e;
        },
        generate: "<base>",
        style: {
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "icons", // Uses the font provided by Breeze
            fontWeight: "normal",
            fontStyle: "normal",
            textRendering: "auto",
            lineHeight: "1",
        },
        style_standard : "<base>",
        style_paddingSmall : "<base>",
        element: "i",
        handleStyle : true,
    }, { // img
        name: "img",
        function: (info, element) => {
            info = Merge.dicts({
                src: "",
                alt: "",
                objectFit: "cover",
                aspectRatio: "auto",
            }, info);

            Tester.dicts({
                src : { type: "string", full: true },
                alt : { type: "string", full: true },
                objectFit : { type: "string", full: true },
                aspectRatio : { type: "string", full: true },
            }, info, `${element.name} Element: `);

            let e = element.generate(info, element);
            e.src = info.src;
            e.alt = info.alt;
            e.style.objectFit = info.objectFit;
            e.style.aspectRatio = info.aspectRatio;

            return e;
            
        },
        style: {
            
        },
        generate: "<base>",
        style_standard : "<base>",
        element: "img",
    }, { // markdown
        name: "markdown",
        function: (info, element) => {
            info = Merge.dicts({
                str : "",
            }, info);

            let markdownStr = "\n" + info.str + "\n";

            let status = {
                h : {enable : false, element : ""},
                b : {enable : false, element : ""},
                i : {enable : false, element : ""},
                u : {enable : false, element : ""},
                a : {enable : false, element : ""},
            };
            let ruitkStr = "";
            let result;
            for (let i = 0; i < markdownStr.length; i++) {
                switch(markdownStr[i]) {
                    case "\n": //headings
                    case "*":
                    case " ":
                    case "_":
                    case "#":
                        let ref = ruitkStr.length;

                        result = general(markdownStr, i, status);
                        ruitkStr += result.str;
                        i = i + result.offset; 

                        result = headings(markdownStr, i, status);
                        ruitkStr += result.str;
                        i = i + result.offset; 

                        result = boldItalic(markdownStr, i, status); 
                        ruitkStr += result.str;
                        i = i + result.offset; 

                        if (ruitkStr.length === ref) {
                            ruitkStr += markdownStr[i];
                        }
                        break;
                    default:
                        ruitkStr += markdownStr[i];
                        break;
                }
            }
            ruitkStr += closeAll(status);
            ruitkStr = ruitkStr.trim();
            ruitkStr = ruitkStr.replaceAll(`\n`, "<br>");
            console.log(ruitkStr);
            return element.makeElements(`<p1>{"content" : "${ruitkStr}"}`);

        },
        handleStyle : true,

    }
];

export class FallenStaging {
    static getElements() {
        return elements;
    }
}


function close(status, key) {
    let ruitkStr = `" `;

    ruitkStr += lazyCloseAll(status);
    status[key].enable = false;
    ruitkStr += lazyOpenAll(status);

    ruitkStr += `"`;
    return ruitkStr;
}
function open(status, key, element) {
    let ruitkStr = `" `;

    ruitkStr += lazyCloseAll(status);
    status[key] = {
        enable : true,
        element : element
    }
    ruitkStr += lazyOpenAll(status);

    ruitkStr += `"`;

    return ruitkStr;
}
function toggle (status, key, element) {
    if (status[key].enable === true) {
        return close(status, key);
    } else {
        return open(status, key, element);
    }

}
function closeAll(status) {
    let ruitkStr = lazyCloseAll(status);

    status = {
        h : {enable : false, element : ""},
        b : {enable : false, element : ""},
        i : {enable : false, element : ""},
        u : {enable : false, element : ""},
        a : {enable : false, element : ""},
    };

    if (ruitkStr.length !== 0) {
        ruitkStr = `" ` + ruitkStr + `"`;
    }

    return ruitkStr;
}
function lazyCloseAll(status) {
    let ruitkStr = "";
    for (let key of Object.keys(status)) {
        if (status[key].enable === true) {
            ruitkStr += `} `;
        }
    }
    
    return ruitkStr;
}
function lazyOpenAll(status) {
    let ruitkStr = "";
    for (let key of Object.keys(status)) {
        if (status[key].enable === true) {
            ruitkStr += status[key].element;
        }
    }
    
    return ruitkStr;
}

function general(markdownStr, i, status) {
    let ruitkStr = "";
    if (status.h.enable === true && markdownStr[i] === "\n") {
        ruitkStr += close(status, "h");
    }
    if (markdownStr.startsWith("\n\n", i)) {
        ruitkStr += closeAll(status);
    }
    return { str : ruitkStr, offset : 0 };
}
function headings(markdownStr, i, status) {
    let ruitkStr = "\n";
    if (markdownStr.startsWith("\n# ", i)) {
        ruitkStr += open(status, "h", `<h1>{"content" : `);
        return { str : ruitkStr, offset : 2 };
    }
    if (markdownStr.startsWith("\n## ", i)) {
        ruitkStr += open(status, "h", `<h2>{"content" : `);
        return { str : ruitkStr, offset : 3 };
    }
    if (markdownStr.startsWith("\n### ", i)) {
        ruitkStr += open(status, "h", `<h3>{"content" : `);
        return { str : ruitkStr, offset : 4 };
    }
    if (markdownStr.startsWith("\n#### ", i)) {
        ruitkStr += open(status, "h", `<h3>{"content" : `);
        return { str : ruitkStr, offset : 5 };
    }
    if (markdownStr.startsWith("\n##### ", i)) {
        ruitkStr += open(status, "h", `<h3>{"content" : `);
        return { str : ruitkStr, offset : 6 };
    }
    if (markdownStr.startsWith("\n###### ", i)) {
        ruitkStr += open(status, "h", `<h3>{"content" : `);
        return { str : ruitkStr, offset : 7 };
    }
    return { str : "", offset : 0 };
}
function boldItalic(markdownStr, i, status) {
    let ruitkStr = "";

    if (/[^A-Za-z0-9_]___/.test(markdownStr.slice(i - 1, i + 3))) {
        ruitkStr += open(status, "i", `<i>{"content" : `);
        ruitkStr += open(status, "b", `<b>{"content" : `);
        return { str : ruitkStr, offset : 2 };
    }
    if (/___[^A-Za-z0-9_]/.test(markdownStr.slice(i , i + 4))) {
        ruitkStr += close(status, "i");
        ruitkStr += close(status, "b");
        return { str : ruitkStr, offset : 2 };
    }

    if (/[^A-Za-z0-9_]__/.test(markdownStr.slice(i - 1, i + 2)) && status.b.enable === false) {
        ruitkStr += open(status, "b", `<b>{"content" : `);
        return { str : ruitkStr, offset : 1 };
    }
    if (/__[^A-Za-z0-9_]/.test(markdownStr.slice(i , i + 3)) && status.b.enable === true) {
        ruitkStr += close(status, "b");
        return { str : ruitkStr, offset : 1 };
    }
    if (markdownStr.startsWith("**", i)) {
        return { str : toggle(status, "b", `<b>{"content" : `), offset : 1 };
    }


    if (/[^A-Za-z0-9_]_/.test(markdownStr.slice(i - 1, i + 1)) && status.i.enable === false) {
        ruitkStr += open(status, "i", `<i>{"content" : `);
        return { str : ruitkStr, offset : 0 };
    }
    if (/_[^A-Za-z0-9_]/.test(markdownStr.slice(i , i + 2)) && status.i.enable === true) {
        ruitkStr += close(status, "i");
        return { str : ruitkStr, offset : 0 };
    }
    if (markdownStr.startsWith("*", i)) {
        return { str : toggle(status, "i", `<i>{"content" : `), offset :  0 };
    }


    return { str : "", offset : 0 };
}