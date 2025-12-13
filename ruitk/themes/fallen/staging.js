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
                        if (status.h.enable === true) {
                            ruitkStr += close(status, "h");
                        }
                        if (markdownStr.startsWith("\n\n", i)) {
                            ruitkStr += closeAll(status);
                        }
                        switch(markdownStr[i + 1]) {
                            case "#": //headings
                                result = hashtagHeadings(markdownStr, i, status); // # H1, etc
                                ruitkStr += result.str;
                                i = result.i; 
                                break;
                            case "_":
                                result = underscoreFormatingOpen(markdownStr, i, status); // # bold and italic underscore formating
                                ruitkStr += result.str;
                                i = result.i; 
                                break;
                            default:
                                ruitkStr += markdownStr[i];
                                break; 
                        }
                        break;
                    case "*":
                        result = starFormating(markdownStr, i, status); // # bold and italic star formating
                        ruitkStr += result.str;
                        i = result.i; 
                        break;
                    case " ":
                        result = underscoreFormatingOpen(markdownStr, i, status); // # bold and italic underscore formating
                        ruitkStr += result.str;
                        i = result.i; 
                        break;
                    case "_":
                        result = underscoreFormatingClose(markdownStr, i, status); // # bold and italic underscore formating
                        ruitkStr += result.str;
                        i = result.i; 
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


function hashtagHeadings(markdownStr, i, status) {
    let ruitkStr = "\n";
    if (markdownStr.startsWith("# ", i + 1)) {
        ruitkStr += open(status, "h", `<h1>{"content" : `);
        return { str : ruitkStr, i : i + 2 };
    }
    if (markdownStr.startsWith("## ", i + 1)) {
        ruitkStr += open(status, "h", `<h2>{"content" : `);
        return { str : ruitkStr, i : i + 3 };
    }
    if (markdownStr.startsWith("### ", i + 1)) {
        ruitkStr += open(status, "h", `<h3>{"content" : `);
        return { str : ruitkStr, i : i + 4 };
    }
    if (markdownStr.startsWith("#### ", i + 1)) {
        ruitkStr += open(status, "h", `<h3>{"content" : `);
        return { str : ruitkStr, i : i + 5 };
    }
    if (markdownStr.startsWith("##### ", i + 1)) {
        ruitkStr += open(status, "h", `<h3>{"content" : `);
        return { str : ruitkStr, i : i + 6 };
    }
    if (markdownStr.startsWith("###### ", i + 1)) {
        ruitkStr += open(status, "h", `<h3>{"content" : `);
        return { str : ruitkStr, i : i + 7 };
    }
    return { str : markdownStr[i], i : i };
}
function starFormating(markdownStr, i, status) {
    if (markdownStr.startsWith("**", i)) {
        return { str : toggle(status, "b", `<b>{"content" : `), i : i + 1 };
    } else {
        return { str : toggle(status, "i", `<i>{"content" : `), i : i };
    }
}
function underscoreFormatingOpen(markdownStr, i, status) {
    let ruitkStr = markdownStr[i];

    if (markdownStr.startsWith(" ___", i) || markdownStr.startsWith("\n___", i)) {
        ruitkStr += open(status, "i", `<i>{"content" : `);
        ruitkStr += open(status, "b", `<b>{"content" : `);
        return { str : ruitkStr, i : i + 3 };
    }

    if (markdownStr.startsWith(" __", i) || markdownStr.startsWith("\n__", i)) {
        ruitkStr += open(status, "b", `<b>{"content" : `);
        return { str : ruitkStr, i : i + 2 };
    }


    if (markdownStr.startsWith(" _", i) || markdownStr.startsWith("\n_", i)) {
        ruitkStr += open(status, "i", `<i>{"content" : `);
        return { str : ruitkStr, i : i + 1 };
    }

    return { str : markdownStr[i], i : i };
}
function underscoreFormatingClose(markdownStr, i, status) {
    let ruitkStr = "";

    if (markdownStr.startsWith("___ ", i) || markdownStr.startsWith("___\n", i)) {
        ruitkStr += close(status, "i");
        ruitkStr += close(status, "b");
        return { str : ruitkStr, i : i + 2 };
    }

    if (markdownStr.startsWith("__ ", i) || markdownStr.startsWith("__\n", i)) {
        ruitkStr += close(status, "b");
        return { str : ruitkStr, i : i + 1 };
    }

    if (markdownStr.startsWith("_ ", i) || markdownStr.startsWith("_\n", i)) {
        ruitkStr += close(status, "i");
        return { str : ruitkStr, i : i };
    }

    return { str : markdownStr[i], i : i };
}