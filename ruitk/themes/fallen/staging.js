import { Merge } from "../../support/merger.js";
import { Style } from "../../support/style.js";
import { Convert } from "../../support/convert.js";
import { Tester } from "../../support/tester.js";

let elements = [
    {
        name: "search",
        function: (info, element) => {
            info = Merge.dicts({
                id : `"search-${element.elementCount}"`,
                callback : () => {console.warn("search Element: missing callback function")},
            }, info);

            let textboxInfo = JSON.parse(JSON.stringify(info));


            let textboxInfoStr = "";
            for (let key in textboxInfo) {
                textboxInfoStr += `${key} : ${textboxInfo[key]}, `;
            }

            let e = element.makeElements(`<textbox>{${textboxInfo}}`)

            return e;
        },
        style: {
        
        },
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
    }
];

export class FallenStaging {
    static getElements() {
        return elements;
    }
}
