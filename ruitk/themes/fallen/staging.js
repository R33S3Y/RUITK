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

            let str = info.str;

            let status = {
                h1 : false,
                h2 : false,
                h3 : false,
                h4 : false,
                h5 : false,
                h6 : false,
                b : false, 
                i : false,
                u : false,
                a : false
            }
            let ruitkStr = "";
            for (let i = 0; i < str.length; i++) {
                let char = str[i];
                
                switch(char) {
                    case "\n":
                        if (status.h1 === true || status.h2 === true || 
                            status.h3 === true || status.h4 === true || 
                            status.h5 === true || status.h6 === true) {
                            ruitkStr += `"} "`
                            ruitkStr += char;
                            status = {
                                h1 : false,
                                h2 : false,
                                h3 : false,
                                h4 : false,
                                h5 : false,
                                h6 : false
                            };
                        }
                        if (str.startsWith("# ", i + 1)) {
                            status.h1 = true;
                            ruitkStr += `\n" <h1>{"content" : "`
                            i = i + 2;
                        }
                    default:
                        ruitkStr += char;
                }
            }
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
