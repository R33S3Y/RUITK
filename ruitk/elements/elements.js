import { Merge } from "../support/merger.js";
import { Style } from "../support/style.js";
import { Tester } from "../support/tester.js";

let logo = `      
             This Project was made with:                        
                                                                
         ██████╗ ██╗   ██╗██╗████████╗██╗  ██╗                  
         ██╔══██╗██║   ██║██║╚══██╔══╝██║ ██╔╝                  
         ██████╔╝██║   ██║██║   ██║   █████╔╝                   
         ██╔══██╗██║   ██║██║   ██║   ██╔═██╗                   
         ██║  ██║╚██████╔╝██║   ██║   ██║  ██╗                  
         ╚═╝  ╚═╝ ╚═════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝                  
                                                                
             https://github.com/R33S3Y/RUITK/                   
        A simple ui library/toolkit for websites.               
             Licensed under GPL-3.0 license.                    
                                                                
Main Dev -          [R33S3Y](https://github.com/R33S3Y)         
 Arist  - [Raphaela](https://www.instagram.com/fredyguy12_art/) 
                                                                 
`

export class Elements {
    constructor() {
        this.elements = [];
        this.elementCount = 0;
        this.initFunctions();
        console.info(logo);
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
                let dict;
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

                let element;
                try {
                    element = elementInfo.function(dict, elementInfo);
                } catch (e) {
                    let errorStr = 
`renderElements Function: Failed to render element: "${elementInfo.name}"
Error : 
${e.message}

Info : 
${JSON.stringify(dict)}

Element : 
${JSON.stringify(elementInfo)}

Callstack : 
${e.stack}`;
                    console.error(errorStr);                    

                    element = document.createElement("h3");
                    element.innerHTML = errorStr.replace(/\n/g, "<br>");

                    elementInfo = {
                        handleStyle : false,
                        style : {
                            color : "red",
                            fontSize : "0.75em"
                        }
                    };
                }

                if (Array.isArray(element) === false) {
                    element = [element];
                }

                if (elementInfo.handleStyle === false) {
                    for (let thing of element) {
                        thing = styleElement(thing, elementInfo);
                    }
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
            //if (str === undefined || str === null) {
            //    return str; // all of these cases are caught by the following test but I think it's better for these case to be handed off smoothly
            //}
            Tester.dicts({
                str : "string",
                softParse : "boolean",
            }, {
                str, softParse
            }, "parse Function: ");
            let info = [];
            str = str.trim();
            if(str.length === 0) {
                console.warn("parse Function: Input str is empty!!!");
                console.trace("Stack trace:");
                return "";
            }
            while(str.length > 0) {

                // this has issues with functions with 2 or more args (looks like differnt issues bettewn arrows and standard)
                // but is 10:46pm so I'm giving up for now
                
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
                    
                    itemEnd = getItemWithCutEnd(str);  
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
                } else if (str.indexOf("=>") !== -1 && str.indexOf("=>") < str.indexOf("{")) { // arrow function
                    itemType = "arrowFunction";

                    itemEnd = getItemWithCutEnd(str);  
                } else if (str.startsWith("function")) { // function
                    itemType = "function";

                    itemEnd = getItemWithCutEnd(str);  
                } else {
                    console.warn("parse Function: str type not found assuming type str");
                    console.debug(`str : "${str}"`);
                    console.trace("Stack trace:");
                    str = `"${str}"`;
                    itemType = "str";
                    itemEnd = str.length;
                }

                if (itemEnd === -1) {
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

                switch (itemType) {
                    case "element":
                        item = this.renderElements(item);
                        info = info.concat(item);
                        break;
                    case "dict":
                        let dict = {};
                        for (let key of Object.keys(item)) {
                            dict[key] = "";
                            if (item[key] !== "") { // this is done to make sure parse does not throw a warning
                                dict[key] = this.parse(item[key]);
                            }
                        }
                        info.push(dict);
                        break;
                    case "array":
                        let array = [];
                        for (let thing of item) {
                            let hold = "";
                            if (thing !== "") {
                                hold = this.parse(thing);
                            }
                            array.push(hold);
                        }
                        info.push(array);
                        break;
                    case "str":
                        item = item.slice(1, -1);
                        info.push(item);
                        break;
                    case "function":
                    case "arrowFunction":
                        item = parseFunction(item);
                        info.push(item);
                        break;
                    default:
                        item = JSON.parse(item);
                        info.push(item);
                        break;
                }

            }

            if (info.length <= 1) {
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
function getItemWithCutEnd(str) {
    let dictStart = str.indexOf("{");
    if (dictStart === -1) {
        console.error("Opening curly brace '{' not found in the string");
        return -1;
    }
    return getDictOrArrayEnd(str.slice(dictStart)) + dictStart;
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
        console.error(`${bracketType} brackets not closed propery in ${str}`); // if this error is triggered it causes the whole thing to shit itself
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
function styleElement(element, elementInfo) {
    if (elementInfo.handleStyle === true) {
        return element;
    }
    let styles = elementInfo.style;

    for(let key of Object.keys(elementInfo)) {
        if(key.startsWith("style_") && typeof elementInfo[key] === "object" && Object.keys(elementInfo[key]).length !== 0 && elementInfo.strictStyles === false) {
            styles = Merge.dicts(elementInfo[key], styles, []);
        }
    }
    Style.style(element, styles);

    return element;
}
function parseFunction(funcString) {
    try {
        // Match the arrow function syntax
        let arrowFunctionMatch = funcString.match(/^\((.*)\)\s*=>\s*{(.*)}$/s);
        if (arrowFunctionMatch) {
            let args = arrowFunctionMatch[1].trim();
            args = softParseInfo(`[${args}]`);
            let body = arrowFunctionMatch[2].trim();
            return new Function(...args, body);
        }

        // Match the traditional function syntax
        let functionMatch = funcString.match(/^function\s*(.*?)\((.*?)\)\s*{([\s\S]*)}$/);
        if (functionMatch) {
            let args = functionMatch[2].trim();
            let body = functionMatch[3].trim();
            return new Function(args, body);
        }

        throw new Error("Invalid function format");
    } catch (err) {
        console.error("parse function: Error:", err.message);
        return null;
    }
}
