import { Style } from "../support/style.js";

export class Internal {
    static softParseInfo(str) {
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
            let inStr = false;
            let strStartChar = "";

            for (let char of str) {

                if (inStr === false) {
                    if (char === '"' || char === "'" || char === '`') {
                        inStr = true;
                        strStartChar = char;
                        currentPart += char;
                        continue;
                    }
                } else {
                    if (char === strStartChar) inStr = false;
                    currentPart += char;
                    continue;
                }
                if (inStr === true) {
                    currentPart += char;
                    continue;
                }

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
    static getItemWithCutEnd(str) {
        let dictStart = str.indexOf("{");
        if (dictStart === -1) {
            console.error("Opening curly brace '{' not found in the string");
            return -1;
        }
        return Internal.getDictOrArrayEnd(str.slice(dictStart)) + dictStart;
    };
    static getDictOrArrayEnd(str) {
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
    static getElementStr(str) { // get some basic info about element from str
        str = str.trim();

        let currentElement = {};

        currentElement.nameStart = str.indexOf("<");
        currentElement.nameEnd = str.indexOf(">");
        currentElement.dictStart = str.indexOf("{");

        if (currentElement.dictStart === -1) {
            console.error("Opening curly brace '{' not found in the string");
            return;
        }

        currentElement.dictEnd = Internal.getDictOrArrayEnd(str.slice(currentElement.dictStart)) + currentElement.dictStart;

        currentElement.str = str.slice(currentElement.nameStart, currentElement.dictEnd);

        return currentElement;
    };
    static styleElement(element, elementInfo) {
        if (elementInfo.handleStyle === true) {
            return element;
        }
        let styles = [elementInfo.style];

        for(let key of Object.keys(elementInfo)) {
            if(key.startsWith("style_") && typeof elementInfo[key] === "object" && Object.keys(elementInfo[key]).length !== 0 && elementInfo.strictStyles === false) {
                styles.push(elementInfo[key]);
            }
        }
        Style.style(element, styles);

        return element;
    };
    static parseFunction(funcString) {
        try {
            // Match the arrow function syntax
            let arrowFunctionMatch = funcString.match(/^\((.*)\)\s*=>\s*{(.*)}$/s);
            if (arrowFunctionMatch) {
                let args = arrowFunctionMatch[1].trim();
                args = Internal.softParseInfo(`[${args}]`);
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
    };
    static resolveElementObject(elementInfo, elements) { // resolves all dependacys using the [Referencing syntax](tileWin/doc/Making%20Elements.md#Other)
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
    static getElementDependencysList(elementInfo, elements) { // just gets a list of all elements that a element depends on
        let dependencys = [];
        for (let key of Object.keys(elementInfo)) {
            if (typeof elementInfo[key] === "string" && /^<[\w\d]+>$/.test(elementInfo[key])) {

                let elementName = elementInfo[key];

                elementName = elementName.replace("<", "");
                elementName = elementName.replace(">", "");

                dependencys.push(elementName);
            }
        }
        if (typeof elementInfo.dependencys === "string" && /^<[\w\d]+>$/.test(elementInfo.dependencys)) {
            let elementName = elementInfo.dependencys;

            elementName = elementName.replace("<", "");
            elementName = elementName.replace(">", "");

            let dependencyRef = this.getElementByName(elementName, elements);

            if (dependencyRef === null) {
                console.warn(`Dependency Error: cannot resolve/find element: "${elementName}". Returning incomplete list of dependacys`);
                return [...new Set(dependencys)];
            }
            dependencys = dependencys.concat(dependencyRef.dependencys);

            return [...new Set(dependencys)];
        }
        if (Array.isArray(elementInfo.dependencys)) {
            dependencys = dependencys.concat(elementInfo.dependencys);
        }

        return [...new Set(dependencys)];
    }
    
    static getElementByName(name, elements) {// gets a element by name. If element cant be found returns null
        for (let element of elements) {
            if (element.name === name) return element;
        }
    
        return null;
    }
}

