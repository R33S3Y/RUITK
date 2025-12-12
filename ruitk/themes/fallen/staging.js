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

            let markdownStr = info.str;

            let status = {
                h : false,
                b : false, 
                i : false,
                u : false,
                a : false
            };
            let ruitkStr = "";
            for (let i = 0; i < markdownStr.length; i++) {
                let result;
                
                switch(markdownStr[i]) {
                    case "\n": //headings
                        if (status.h === true) {
                            ruitkStr += `"} "`;
                            status.h = false;
                        }
                        result = hashtagHeadings(markdownStr, i, status); // # H1, etc
                        ruitkStr += result.str;
                        i = result.i; 
                        break;
                    case "*":
                        result = starFormating(markdownStr, i, status); // # bold and italic star formating
                        ruitkStr += result.str;
                        i = result.i; 
                        break;
                    default:
                        ruitkStr += markdownStr[i];
                        break;
                }
            }

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

function hashtagHeadings(markdownStr, i, status) {
    let ruitkStr = "";
    if (markdownStr.startsWith("# ", i + 1)) {
        status.h = true;
        ruitkStr = `\n" <h1>{"content" : "`;
        return { str : ruitkStr, i : i + 2 };
    }
    if (markdownStr.startsWith("## ", i + 1)) {
        status.h = true;
        ruitkStr = `\n" <h2>{"content" : "`;
        return { str : ruitkStr, i : i + 3 };
    }
    if (markdownStr.startsWith("### ", i + 1)) {
        status.h = true;
        ruitkStr = `\n" <h3>{"content" : "`;
        return { str : ruitkStr, i : i + 4 };
    }
    if (markdownStr.startsWith("#### ", i + 1)) {
        status.h = true;
        ruitkStr = `\n" <h3>{"content" : "`;
        return { str : ruitkStr, i : i + 5 };
    }
    if (markdownStr.startsWith("##### ", i + 1)) {
        status.h = true;
        ruitkStr = `\n" <h3>{"content" : "`;
        return { str : ruitkStr, i : i + 6 };
    }
    if (markdownStr.startsWith("###### ", i + 1)) {
        status.h = true;
        ruitkStr = `\n" <h3>{"content" : "`;
        return { str : ruitkStr, i : i + 7 };
    }
    return { str : markdownStr[i], i : i };
}
function starFormating(markdownStr, i, status) {
    let ruitkStr = "";
    if (markdownStr.startsWith("**", i)) {
        status.b = !status.b;
        if (status.b === true) {
            ruitkStr = `" <b>{"content" : "`;
        } else {
            ruitkStr += `"} "`;
        }
        return { str : ruitkStr, i : i + 1 };
    } else {
        status.i = !status.i;
        if (status.i === true) {
            ruitkStr = `" <i>{"content" : "`;
        } else {
            ruitkStr += `"} "`;
        }
        return { str : ruitkStr, i : i };
    }
}
function safeClose(element) {

}
function safeOpen(element) {

}
function closeAll(element) {

}