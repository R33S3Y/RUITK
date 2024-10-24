import { Merge } from "../support/merger.js";
import { Style } from "../support/style.js";
export class Elements {
    constructor() {
        this.elements = [];
        this.elementCount = 0;
        this.initMakeElements();
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
            }, element);
            this.elements.push(element);
        }
        this.initMakeElements();
        return;
    }
    initMakeElements () {
        /**
         * We have this function because we need to define makeElements as an arrow function so it can be passed through the elements while not changing the this context
         */
        this.makeElements = (str) => {
            const removeQuotes = (str) => {
                str = str.trim();
                if((str.startsWith('"') || str.startsWith("'") || str.startsWith("`")) && (str.endsWith('"') || str.endsWith("'") || str.endsWith("`"))) {
                    return str.slice(1, str.length-1);
                }
                return str;
            };
            const isElement = (str) => {
                // Define the regular expression to match the pattern <elementName>{...}
                const regex = /<\w+>{[^}]*}/g;
              
                // Test the string against the regex
                return regex.test(str);
            };
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
            };
            const softParseInfo = (str) => {
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
                
                let keyValuePairs = splitTopLevel(str.slice(1, -1)); // Remove outermost curly braces
                let values = {};
    
                if(str.startsWith("{")) { // doing this if statement adds support for arrays 
                    keyValuePairs.forEach(pair => {
                        let splitIndex = pair.indexOf(':');
                        
                        if (splitIndex !== -1) {
                            let value = pair.slice(splitIndex + 1).trim();
                            let key = pair.slice(0, splitIndex).trim();
                            key = removeQuotes(key);
                            values[key] = value;
                        }
                    });
                    return values;
                } else {
                    return keyValuePairs;
                }
            };
            const getNumberEnd = (str) => {
                let i = 0
                for (let char of str) {
                    if (!isNaN(char) || char === ".") {
                        i++;
                    } else {
                        return i;
                    }
                }
                return i;
            };
            const resolveInfo = (str) => {
                let info = [];
                str = str.trim();
                while(str.length > 0) {
                    
                    let itemEnd = 0;
                    let itemType = ""
                    
                    str = str.trim();
                    if (str.startsWith('"') || str.startsWith("'") || str.startsWith("`")) {// item is str
                        itemType = "str";
                        itemEnd = str.slice(1).indexOf(str[0])+2; // 1 to make up for the slice + 1 to include the last qoute
                    } else if (str.startsWith("{")) { // array or dict
                        itemType = "dict";
                        itemEnd = getIndentStrEnd(str);
                    } else if (str.startsWith("[")) { // array or dict
                        itemType = "array";
                        itemEnd = getIndentStrEnd(str);
                    } else if (str.startsWith("<")) { // is element
                        itemType = "element";
                        itemEnd = getElementStr(str).dictEnd;
                    } else if (!isNaN(str.charAt(0))) { //is number
                        itemType = "number";
                        itemEnd = getNumberEnd(str);
                    } else {
                        console.error("str type not found");
                        console.debug(`str : "${str}"`);
                        if (info.length >= 1) {
                            info = info[0];
                        }
                        return info;
                    }
    
                    let item = str.slice(0, itemEnd);
                    str = str.slice(itemEnd);
    
                    if (itemType === "element") {
                        item = this.makeElements(item);
                        info = info.concat(item);
                    } else if (itemType === "dict") {
                        item = parseDict(item);
                        info.push(item);
                    } else if (itemType === "array") {
                        item = parseArray(item);
                        info.push(item);
                    } else {
                        item = JSON.parse(item);
                        info.push(item);
                    }
                }
    
                if (info.length >= 1) {
                    info = info[0];
                }
                return info;
            };
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
            };
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
            };
            const parseDict = (str) => {
                let softDict = softParseInfo(str);
                let dict = {};
                for (let key of Object.keys(softDict)) {
                    dict[key] = resolveInfo(softDict[key]);
                }
                return dict;
            }
            const parseArray = (str) => {
                let softArray = softParseInfo(str);
                let array = [];
                for (let item of softArray) {
                    array.push(resolveInfo(item));
                }
                return array;
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
                let dict = parseDict(dictStr);
                
                elementInfo.makeElements = this.makeElements;
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
        }
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