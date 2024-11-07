import { Merge } from "../support/merger.js";
import { Style } from "../support/style.js";

export class Elements {
    constructor() {
        this.elements = [];
        this.elementCount = 0;
        this.initFunctions();
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
        let failCount = 0;
        for (let element of elements) {
            for (let currentElement of this.elements) {
                if (currentElement.name === element.name) {
                    console.warn(`${element.name} has already been used thus ${element} has been regected`);
                    failCount ++;
                    continue;
                }
            }
            element = Merge.dicts({
                name : "",
                function : (info, element) => {
                    return document.createElement("div");
                },
                style : {},
                handleStyle : false,
                parseLevel : 2,
                strictStyles : false,
            }, element, []);
            this.elements.push(element);
        }
        console.debug(`addElements Function: Added ${elements.length - failCount} out of ${elements.length} new elements`);
        console.debug(`addElements Function: Starting dependency test`);

        /**
         * This could be set up as a minor preformance inprovement.
         * 
         * In witch you resolve and save the element once instead of resolving the element every time it is called at runtime.
         * It may also increase the size and memory reqiurements of this.elements. IDK just a thought.
         */
        elements = JSON.parse(JSON.stringify(elements));
        for (let element of elements) {
            resolveElementObject(element, this.elements);
        }

        console.debug(`addElements Function: Finished dependency test`);

        this.initFunctions();
        return;
    }
    initFunctions () {
        /**
         * We have this function because we need to define makeElements as an arrow function so it can be passed through the elements while not changing the this context
         */
        this.renderElements = (str) => {

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
                elementInfo = resolveElementObject(elementInfo, this.elements);
    
                let dictStr = currentStr.slice(currentElement.dictStart, currentElement.dictEnd);
                let dict
                if(elementInfo.parseLevel === 0) {
                    dict = dictStr;
                } else {
                    let softParse = false;
                    if (elementInfo.parseLevel === 1) {
                        softParse = true;
                    }
                    dict = this.parse(dictStr, softParse);
                }
                
                elementInfo.makeElements = this.makeElements;
                elementInfo.parse = this.parse;
                elementInfo.elementCount =  this.elementCount;

                this.elementCount ++;
    
                let element = elementInfo.function(dict, elementInfo);
    
                if (typeof elementInfo.style === "object" && Object.keys(elementInfo.style).length !== 0 && elementInfo.handleStyle === false) {
                    Style.style(element, elementInfo.style);
                }
                
                if (Array.isArray(element) === false) {
                    element = [element];
                }
                currentStr = currentStr.replace(currentElement.str, "").trim();
                
                output = output.concat(element);
            }
            return output;
        };

        this.makeElements = (str) => {
            return this.parse(str);
        };
    
        this.parse = (str, softParse = false) => {
            let info = [];
            str = str.trim();
            while(str.length > 0) {
                
                let itemEnd = 0;
                let itemType = "";
                
                str = str.trim();
                if (str.startsWith('"') || str.startsWith("'") || str.startsWith("`")) {// item is str
                    itemType = "str";
                    itemEnd = str.slice(1).indexOf(str[0])+2; // 1 to make up for the slice + 1 to include the last qoute
                } else if (str.startsWith("{")) { // dict
                    itemType = "dict";
                    itemEnd = getDictOrArrayEnd(str);
                } else if (str.startsWith("[")) { // array
                    itemType = "array";
                    itemEnd = getDictOrArrayEnd(str);
                } else if (str.startsWith("<")) { // is element
                    itemType = "element";
                    
                    let dictStart = str.indexOf("{");
                    if (dictStart === -1) {
                        console.error("Opening curly brace '{' not found in the string");
                        if (info.length === 1) {
                            info = info[0];
                        }
                        return info;
                    }
                    itemEnd = getDictOrArrayEnd(str.slice(dictStart)) + dictStart;
                            
                } else if (!isNaN(str.charAt(0))) { //is number
                    itemType = "number";

                    let i = 0
                    for (let char of str) {
                        if (!isNaN(char) || char === ".") {
                            i++;
                        } else {
                            itemEnd = i;
                            break;
                        }
                    }
                    itemEnd = i;
                } else {
                    console.error("str type not found");
                    console.debug(`str : "${str}"`);
                    if (info.length === 1) {
                        info = info[0];
                    }
                    return info;
                }

                let item = str.slice(0, itemEnd);
                str = str.slice(itemEnd);

                if (itemType === "dict" || itemType === "array") {
                    item = softParseInfo(item);
                }
                if(softParse === true) {
                    info.push(item);
                    continue;
                }

                if (itemType === "element") {
                    item = this.renderElements(item);
                    info = info.concat(item);
                } else if (itemType === "dict") {
                    let dict = {};
                    for (let key of Object.keys(item)) {
                        dict[key] = this.parse(item[key]);
                    }
                    info.push(dict);
                } else if (itemType === "array") {
                    let array = [];
                    for (let thing of item) {
                        array.push(this.parse(thing));
                    }
                    info.push(array);
                } else {
                    item = JSON.parse(item);
                    info.push(item);
                }
            }

            if (info.length === 1) {
                info = info[0];
            }
            return info;

        };
    }
    append(querySelector, content) {
        if (!content) {
            console.error(`item (${content}) is falsely`);
            return;
        }
        if (Array.isArray(content) === false) {
            content = [content];
        }
        let p = document.querySelector(querySelector);
        if (!p) {
            console.error("querySelector not found");
            return;
        }
        for (let item of content) {
            p.appendChild(item);
        }
    }
}

/**
 * HELPER FUNCTIONS
 */

function softParseInfo(str) {
    /**
     * this function takes a stringify dict or array for input and parses that object but leaves all values inside as strings for futher processing
     * @param {string} str 
     * @returns array or dict of strs
     */


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
    
    let keyValuePairs = splitTopLevel(str.slice(1, -1).trim()); // Remove outermost curly braces
    let values = {};

    if(str.startsWith("{")) { // doing this if statement adds support for arrays 
        keyValuePairs.forEach(pair => {
            let splitIndex = pair.indexOf(':');
            
            if (splitIndex !== -1) {
                let value = pair.slice(splitIndex + 1).trim();
                let key = pair.slice(0, splitIndex).trim();
                key = key.trim();
                if((key.startsWith('"') || key.startsWith("'") || key.startsWith("`")) && (key.endsWith('"') || key.endsWith("'") || key.endsWith("`"))) {
                    key = key.slice(1, key.length-1);
                }
                values[key] = value;
            }
        });
        return values;
    } else {
        return keyValuePairs;
    }
};
function getDictOrArrayEnd(str) {
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
        console.error(`${bracketType} brackets not closed propery in ${str}`);
        return 0;
    }
    return end + 1;
};
function getElementStr(str) { // get some basic info about element from str
    str = str.trim();

    let currentElement = {};

    currentElement.nameStart = str.indexOf("<");
    currentElement.nameEnd = str.indexOf(">");
    currentElement.dictStart = str.indexOf("{");

    if (currentElement.dictStart === -1) {
        console.error("Opening curly brace '{' not found in the string");
        return;
    }

    currentElement.dictEnd = getDictOrArrayEnd(str.slice(currentElement.dictStart)) + currentElement.dictStart;

    currentElement.str = str.slice(currentElement.nameStart, currentElement.dictEnd);

    return currentElement;
};
function resolveElementObject(elementInfo, elements) {
    let keys = Object.keys(elementInfo);
    for (let key of keys) {
        let regex = /^<[\w\d]+>$/;
        if (typeof elementInfo[key] === "string" && regex.test(elementInfo[key])) {

            let elementName = elementInfo[key];

            elementName = elementName.replace("<", "");
            elementName = elementName.replace(">", "");
            
            let foundElement = false
            for(let element of elements) {
                if (element.name === elementName) {
                    foundElement = true;
                    if (element[key] === undefined) {
                        console.error(`Dependency Error: key: "${key}" is undefined in Element: "${element.name}". \n Key is used as a depenancy for Element: "${elementInfo.name}"`);
                    }
                    elementInfo[key] = element[key];
                    break;
                }
            }
            if (foundElement === false) {
                console.error(`Dependency Error: Failed to find Element: "${elementName}" which is needed as a dependancy for Element: "${elementInfo.name}"`);
                elementInfo[key] = undefined;
            }
        }
    }
    return elementInfo;
};