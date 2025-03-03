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
                size: "24px",  // Default size
                color: "var(--standout1)", // Default color
            }, info);
    
            let e = element.generate(info, element);
            e.classList.add("icon", `icon_${info.name}`);
            e.style.fontSize = info.size;
            e.style.color = info.color;
    
            return e;
        },
        generate: "<base>",
        style: {
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "icon", // Uses the font provided by Breeze
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
