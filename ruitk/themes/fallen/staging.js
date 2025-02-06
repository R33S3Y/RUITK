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
    {
        name: "icon",
        function: (info, element) => {
            
        },
        style: {
            
        },
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
