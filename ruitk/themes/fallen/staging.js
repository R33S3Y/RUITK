import { Merge } from "../../support/merger.js";
import { Style } from "../../support/style.js";
import { Convert } from "../../support/convert.js";
import { Tester } from "../../support/tester.js";

let elements = [
    {
        name: "search",
        function: (info, element) => {
            info = Merge.dicts({
                id : `"${element.name}-${element.elementCount}"`,
                callback : (value) => {console.warn("search Element: missing callback function")},
            }, info);

            let textboxInfo = JSON.parse(JSON.stringify(info));


            let textboxInfoStr = "";
            for (let key in textboxInfo) {
                textboxInfoStr += `${key} : ${textboxInfo[key]}, `;
            }

            let e = element.makeElements(`<textbox>{${textboxInfoStr}}`);

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
            
            let icon = element.makeElements(`<icon>{name : "editFind", color : "var(--accent3)", c : 2, r : 2}`);

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
            e.style.color = info.color;
    
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
        element: "i"
    },
    {
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
    {
        name: "markdown",
        function: (info, element) => {
            info = Merge.dicts({
                str : "",
            }, info);

            
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
