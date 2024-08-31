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
        const removeQuotes = (str) => {
            str = str.trim();
            if((str.startsWith('"') || str.startsWith("'") || str.startsWith("`")) && (str.endsWith('"') || str.endsWith("'") || str.endsWith("`"))) {
                return str.slice(1, str.length-1);
            }
            return str;
        }

        const isElement = (str) => {
            // Define the regular expression to match the pattern <elementName>{...}
            const regex = /<\w+>{[^}]*}/g;
          
            // Test the string against the regex
            return regex.test(str);
        }
        const resolveElementKey = (item, dictName) => {
            let regex = /^<[\w\d]+>$/;
            if (typeof item === "string" && regex.test(item)) {
                item = item.replace("<", "");
                item = item.replace(">", "");

                for(let element of this.elements) {
                    if (element.name === item) {
                        return element[dictName];
                    }
                }
            }
            return item;
        }
        const softParseInfo = (str) => {

            // A helper function to split by commas but only at the top level
            function splitTopLevel(str) {
                let result = [];
                let braceDepth = 0;
                let bracketDepth = 0;
                let currentPart = '';

                for (let char of str) {
                    if (char === '{') braceDepth++;
                    if (char === '}') braceDepth--;
                    if (char === '[') bracketDepth++;
                    if (char === ']') bracketDepth--;

                    if (char === ',' && braceDepth === 0 && bracketDepth === 0) {
                        result.push(currentPart);
                        currentPart = '';
                    } else {
                        currentPart += char;
                    }
                }
                if (currentPart) result.push(currentPart); // Add the last part
                return result;
            }

            // Main processing
            let keyValuePairs = splitTopLevel(str.slice(1, -1)); // Remove outermost curly braces
            let values = {};

            keyValuePairs.forEach(pair => {
                // Find the first colon, assuming key and value are somewhat intact
                let splitIndex = pair.indexOf(':');
                
                if (splitIndex !== -1) {
                    let value = pair.slice(splitIndex + 1).trim();
                    let key = pair.slice(0, splitIndex).trim();
                    key = removeQuotes(key);
                    values[key] = value;
                }
            });

            return values;
        }
        const resolveInfo = (str) => {
            let info = [];
            let hadElement = false;
            while(str.length > 0) {
                
                let itemEnd = 0;
                let isElement = false;
                
                str = str.trim();
                if (str.startsWith('"') || str.startsWith("'") || str.startsWith("`")) {// item is str
                    itemEnd = str.slice(1).indexOf(str[0])+2; // 1 to make up for the slice + 1 to include the last qoute
                } else if (str.startsWith("{") || str.startsWith("[")) { // array or dict
                    itemEnd = getIndentStrEnd(str);
                } else if (str.startsWith("<")) { // is element
                    isElement = true;
                    hadElement = true;
                    itemEnd = getElementStr(str).dictEnd;
                } else {
                    console.error("str type not found");
                    if (hadElement === false && info.length === 0) {
                        info = info[0];
                    }
                    return info;
                }

                let item = str.slice(0, itemEnd);
                str = str.slice(itemEnd);

                if (isElement === true) {
                    item = this.makeElements(item);
                    info = info.concat(item);
                } else {
                    item = JSON.parse(item);
                    info.push(item);
                }
            }
            if (hadElement === false && info.length === 0) {
                info = info[0];
            }
            return info;
        }
        const getElementStr = (str) => {
            str = str.trim();

            let currentElement = {};

            currentElement.nameStart = str.indexOf("<");
            currentElement.nameEnd = str.indexOf(">");
            currentElement.dictStart = str.indexOf("{");

            if (currentElement.dictStart === -1) {
                console.error("Opening curly brace '{' not found in the string");
                return;
            }

            currentElement.dictEnd = getIndentStrEnd(str.slice(currentElement.dictStart)) + currentElement.dictStart;

            currentElement.str = str.slice(currentElement.nameStart, currentElement.dictEnd);

            return currentElement;
        }
        const getIndentStrEnd = (str) => {
            str = str.trim();
            let indentAmount = 0;
            let end = 0;
            let bracketType = "";
            if (str[0] === "[") {
                bracketType = "square";
            }
            if (str[0] === "{") {
                bracketType = "curly";
            }
            if (bracketType === "") {
                console.error(`input (${str}) not valid`);
                return 0;
            }

            for (let i = 0; i < str.length; i++) {
                let char = str[i];

                if ((char === "{" && bracketType === "curly") || (char === "[" && bracketType === "square")) {
                    indentAmount++;
                }
                if ((char === "}" && bracketType === "curly") || (char === "]" && bracketType === "square")) {
                    indentAmount--;
                }
                if (indentAmount === 0) {
                    end =  i;
                    break;
                }
            }
            if (end === 0) {
                console.error(`${bracketType} brackets not closed propery in ${currentStr}`);
                return 0;
            }
            return end + 1;
        }
        

        let currentStr = str.trim();
        let output = [];
        while(currentStr.length > 0) {
            
            let currentElement = getElementStr(currentStr);
            
            let name = currentElement.str.slice(currentElement.str.indexOf("<")+1, currentElement.str.indexOf(">"));
            let elementInfo;
            for(let element of this.elements) {
                if (element.name === name) {
                    elementInfo = element;
                    break;
                }
            }
            if (elementInfo === undefined) {
                console.error(`could't find an element called "${name}" dumping elements to debug`);
                console.debug(JSON.parse(JSON.stringify(this.elements)));
                return;
            }
            let keys = Object.keys(elementInfo);
            for (let key of keys) {
                elementInfo[key] = resolveElementKey(elementInfo[key], key);
            }

            

            let dictStr = currentStr.slice(currentElement.dictStart, currentElement.dictEnd);
            let softDict = softParseInfo(dictStr);
            let dict = {};
            keys = Object.keys(softDict);
            for (let key of keys) {
                dict[key] = resolveInfo(softDict[key]);
            }
            
            let element = elementInfo.function(dict, elementInfo);
            Style.style(element, elementInfo.style);
            
            currentStr = currentStr.replace(currentElement.str, "").trim();
            
            output.push(element);
        }
        return output;
    }

    append(content, querySelector) {
        if (!content) {
            console.error(`item (${content}) is falsely`);
            return;
        }
        if (Array.isArray(content) === false) {
            content = [content];
        }
        let p = document.querySelector(querySelector);
        
        for (let item of content) {
            p.appendChild(item);
        }
    }
}