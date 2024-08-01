import { Merge } from "../support/merger.js";
import { Style } from "../support/style.js";
export class Elements {
    constructor() {
        this.elements = [];
    }

    addElements(elements = []) {
        /**
         * Element example
         * {
         * name : "button1",
         * function : (inputDict, element) => {
         *      return document.createElement("button");
         * },
         * style : {
         *  transition: "all 0.2s ease-in-out",
         *  position : "absolute",
         *  overflow : "hidden",
         *  // background
         *  backgroundColor : colors.inactiveB1,
         *  backdropFilter: "blur(4px)",
         *  hover_backgroundColor : colors.activeB1,
         *  
         *  // border
         *  borderStyle : "solid",
         *  borderWidth : "3px",
         *  borderRadius : "15px",
         *  borderColor : colors.inactiveH2,
         *  boxShadow: "0 0 4px rgba(0, 0, 0, 1)",
         *  hover_boxShadow: "0 0 5px 2px rgba(0, 0, 0, 1)",
         *  hover_borderColor : colors.activeH2,
         *  }
         * }
         */
        if (Array.isArray(elements) === false) {
            elements = [elements];
        }
        for (let element of elements) {
            for (let currentElement of this.elements) {
                if (currentElement.name === element.name) {
                    console.warn(`${element.name} has already been used thus ${element} has been regected`);
                    return;
                }
            }
            this.elements.push(element);
        }
        return;
    }

    makeElements(str) {
        function isElement(str) {
            // Define the regular expression to match the pattern <elementName>{...}
            const regex = /<\w+>{[^}]*}/g;
          
            // Test the string against the regex
            return regex.test(str);
        }
        function resolve(item, dictName, t) {
            let regex = /^<[\w\d]+>$/;
            if (typeof item === "string" && regex.test(item)) {
                item = item.replace("<", "");
                item = item.replace(">", "");

                for(let element of t.elements) {
                    if (element.name === item) {
                        return element[dictName];
                    }
                }
            }
            return item;
        }
        let currentStr = str.trim();
        let output = [];
        while(currentStr.length > 0) {
            let currentElement = {};

            currentElement.nameStart = currentStr.indexOf("<");
            currentElement.nameEnd = currentStr.indexOf(">");
            currentElement.dictStart = currentStr.indexOf("{");

            if (currentElement.dictStart === -1) {
                console.error("Opening curly brace '{' not found in the string");
                return;
            }

            currentElement.dictEnd = 0;
            let indentAmount = 0;
            let indentCountStr = currentStr.slice(currentElement.dictStart)
            for (let i = 0; i < indentCountStr.length; i++) {
                let char = indentCountStr[i];

                if (char === "{") {
                    indentAmount++;
                }
                if (char === "}") {
                    indentAmount--;
                }
                if (indentAmount === 0) {
                    currentElement.dictEnd = currentElement.dictStart + i;
                    break;
                }
            }
            if (currentElement.dictEnd === 0) {
                console.error(`curly brackets not closed propery in ${currentStr}`);
                continue;
            }

            currentElement.str = currentStr.slice(currentElement.nameStart, currentElement.dictEnd+1);
            
            
            let dictStr = currentStr.slice(currentElement.dictStart, currentElement.dictEnd+1);
            let dict = JSON.parse(dictStr);
            let name = currentElement.str.slice(currentElement.str.indexOf("<")+1, currentElement.str.indexOf(">"));
            if (Object.keys(dict).length !== 0) {
                for (let item in dict) {
                    if(typeof item === 'string' && isElement(item)) {
                        item = this.makeElements(item); // shouldn't need protection against infinte loop as it is protected by the srinking of str
                    }
                }
            }
            

            let elementInfo;
            for(let element of this.elements) {
                if (element.name === name) {
                    elementInfo = element;
                    break;
                }
            }
            let keys = Object.keys(elementInfo);
            for (let key of keys) {
                elementInfo[key] = resolve(elementInfo[key], key, this);
            }
            
            let element = elementInfo.function(dict, elementInfo);
            Style.style(element, elementInfo.style);
            
            currentStr = currentStr.replace(currentElement.str, "").trim();
            
            output.push(element);
        }
        return output;
    }
}