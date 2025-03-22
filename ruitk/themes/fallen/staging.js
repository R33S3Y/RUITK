import { Merge } from "../../support/merger.js";
import { Style } from "../../support/style.js";
import { Convert } from "../../support/convert.js";
import { Tester } from "../../support/tester.js";

let elements = [
    { // search
        name: "search",
        function: (info, element) => {
            info = Merge.dicts({
                id : `"${element.name}-${element.elementCount}"`,
                callback : `(value) => {console.warn("search Element: missing callback function")}`,
            }, info);

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
    },
    { // icon
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
            e = Style.style(e, [{color : info.color, hover_color : info.hoverColor}, element.style]);
    
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
        element: "i",
        handleStyle : true,
    },
    { // img
        name: "img",
        function: (info, element) => {
            info = Merge.dicts({
                id: `img-${element.elementCount}`,
                src: "",
                alt: "Image",
            }, info);

            
        },
        style: {
            
        },
        style_standard : "<base>",
    },
    { // markdown
        name: "markdown",
        function: (info, element) => {
            info = Merge.dicts({
                str : "",
            }, info);

            let elements = [];

            function findElement(str, pattern, type) {
                let matches = [];
                let match;
                
                while ((match = pattern.exec(str)) !== null) {
                    matches.push({ str : match[0], content : match[1], index : match.index, type : type});
                }
                
                return matches;
            }

            /**
             * please note: This is intend to work the same as obsidain during edge cases
             * with the following exemptions
             *  - no incomplete statements Eg *italic
             */
            

            // headings
            elements.concat(findMatches(info.str, /^#\s+(.+)$/gm, "h1"));
            elements.concat(findMatches(info.str, /^##\s+(.+)$/gm, "h2"));
            elements.concat(findMatches(info.str, /^###\s+(.+)$/gm, "h3"));
            elements.concat(findMatches(info.str, /^####\s+(.+)$/gm, "h4"));
            elements.concat(findMatches(info.str, /^#####\s+(.+)$/gm, "h5"));
            elements.concat(findMatches(info.str, /^######\s+(.+)$/gm, "h6"));

            elements.concat(findMatches(info.str, /^(.+)\n=+$/gm, "h1"));
            elements.concat(findMatches(info.str, /^(.+)\n--+$/gm, "h2"));

            // bold
            elements.concat(findMatches(info.str, /\*\*([^\*]+)\*\*/gm, "b"));
            elements.concat(findMatches(info.str, /\s__(.+?)__\s/gm, "b"));

            // italic

            
        },
        style: {
            
        },
        style_standard : "<base>",
    },
];

export class FallenStaging {
    static getElements() {
        return elements;
    }
}
