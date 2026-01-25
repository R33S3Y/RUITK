import { Style } from "../support/style.js";

export class Internal {
    /**
     * Parses a dict at the top level (like the parseLevel = 1 in [Optional Keys](../../doc/Making%20Elements.md#Optional%20Keys))
     * @param {string} str  
     * @returns {array | dict}
     */
    static softParseInfo(str) {
        /**
         * this function takes a stringify dict or array for input and parses that object but leaves all values inside as strings for futher processing
         * @param {string} str 
         * @returns {array | dict} of strs
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
    /**
     * finds the end of the unparsed str at the for the following type:
     *  - arrowfunctions
     *  - function
     *  - element
     * should also work for the dict and array but yeah
     * @param {string} str 
     * @returns {number} will return -1 on error
     */
    static getItemWithCutEnd(str) {
        let dictStart = str.indexOf("{");
        if (dictStart === -1) {
            console.error("Opening curly brace '{' not found in the string");
            return -1;
        }
        return Internal.getDictOrArrayEnd(str.slice(dictStart)) + dictStart;
    };
    /**
     * Gets the end of a array and dict
     * @param {string} str Gets the end of a array or a dict from the unparsed str  
     * @returns {number} 
     */
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
    /**
     * Gets some basic info about the raw string. 
     * The element has to be at the start of the string, However anything can go after the end of the string.
     * @param {string} str The raw unparsed element string   
     * @returns {nameStart : number, nameEnd : number, dictStart : number, dictEnd : number, str : number} info.
     */
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
    /**
     * Handles the style_ and .style and syntax and applys the style.
     * @param {HTML} element The HTML element that needs to to be styled.
     * @param {dict} elementInfo The element that contans the style element info.
     * @returns {HTML} the styled HTML element.
     */
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
    /**
     * Parses/destringifys a function 
     * @param {string} funcString stringifyed function
     * @returns {function} function
     */
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
    /**
     * Resolves all the [Referencing syntax](tileWin/doc/Making%20Elements.md#Other)
     * @param {dict} element The element that you want to resolve
     * @param {Array} elements The list of the elements that we resolve the element aganist
     * @returns {dict} the resolved element.
     */
    static resolveElementObject(element, elements) {
        let keys = Object.keys(element);
        for (let key of keys) {
            let regex = /^<[\w\d]+>$/;
            if (typeof element[key] === "string" && regex.test(element[key])) {

                let elementName = element[key];

                elementName = elementName.replace("<", "");
                elementName = elementName.replace(">", "");
                
                let foundElement = false
                for(let element of elements) {
                    if (element.name === elementName) {
                        foundElement = true;
                        if (element[key] === undefined) {
                            console.error(`Dependency Error: key: "${key}" is undefined in Element: "${element.name}". \n Key is used as a depenancy for Element: "${element.name}"`);
                        }
                        element[key] = element[key];
                        break;
                    }
                }
                if (foundElement === false) {
                    console.error(`Dependency Error: Failed to find Element: "${elementName}" which is needed as a dependancy for Element: "${element.name}"`);
                    element[key] = undefined;
                }
            }
        }
        return element;
    };
    /**
     * Gets a list of all dependacys that a elements needs.
     * @param {dict} element The element that you want to get the dependacys of.
     * @param {Array} elements  A list of all elements that exist. (For when the element references a differnet element dependacy list) [Referencing syntax](../../doc/Making%20Elements.md#Other)
     * @returns {string} Gets a list of all elements that the element depends on.
     */
    static getElementDependencysList(element, elements) {
        let dependencys = [];
        for (let key of Object.keys(element)) {
            if (typeof element[key] === "string" && /^<[\w\d]+>$/.test(element[key])) {

                let elementName = element[key];

                elementName = elementName.replace("<", "");
                elementName = elementName.replace(">", "");

                dependencys.push(elementName);
            }
        }
        if (typeof element.dependencys === "string" && /^<[\w\d]+>$/.test(element.dependencys)) {
            let elementName = element.dependencys;

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
        if (Array.isArray(element.dependencys)) {
            dependencys = dependencys.concat(element.dependencys);
        }

        return [...new Set(dependencys)];
    }
    /**
     * Gets the element by a name. This is really shouldnt exist.
     * @param {string} name Name of element
     * @param {Array} elements Array of elements
     * @returns {(dict|null)} Element or null if no element was found
     */
    static getElementByName(name, elements) {
        for (let element of elements) {
            if (element.name === name) return element;
        }
    
        return null;
    }
}

