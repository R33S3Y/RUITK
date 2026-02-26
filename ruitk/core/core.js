import { Tester } from "../support/tester.js";
import { Internal } from "./internal.js";

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

export class Ruitk {
    constructor() {
        this.elements = [];
        this.elementCount = 0;
        this.initFunctions();
        console.info(logo);
    }
    /**
     * We have this function because we need to define makeElements as an arrow function so it can be passed through the elements while not changing the this context
     */
    initFunctions () {
        /**
         * INTERNAL ONLY!!! - (please use makeElements instead) 
         * Handles the parsing and rendering of elements. 
         * @param {str} str element str 
         * @returns {array | HTMLElement } element
         */
        this.renderElements = (str) => {

            let currentStr = str.trim();
            let output = [];
            while(currentStr.length > 0) {
                
                let currentElement = Internal.getElementStr(currentStr);
                
                let name = currentElement.str.slice(currentElement.str.indexOf("<")+1, currentElement.str.indexOf(">"));
                let elementInfo;
                for(let element of this.elements) {
                    if (element.name === name) {
                        elementInfo = element;
                        break;
                    }
                }
                if (elementInfo === undefined) {
                    console.error(`renderElements Function: could't find an element called "${name}" dumping elements to debug`);
                    console.debug(JSON.parse(JSON.stringify(this.elements)));
                    return;
                }
                elementInfo = Internal.resolveElementObject(elementInfo, this.elements);
    
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
                        thing = Internal.styleElement(thing, elementInfo);
                    }
                }
                
                
                currentStr = currentStr.replace(currentElement.str, "").trim();
                
                output = output.concat(element);
            }
            return output;
        };
        /**
         * Parses the elements
         * @param {string} str unparsed RUTIK JSON 
         * @returns {*} parsed info
         */
        this.makeElements = (str) => {
            // This func used to do stuff but the parse function got several rounds of refactoring 
            // and ended up just doing everything this func did better than this func itself, so yeah.
            return this.parse(str);
        };
        /**
         * Parses pretty json
         * @param {string} str unparsed pretty JSON 
         * @param {boolean} softParse if this flag is true it will only parse the top level (like the parseLevel = 1 in [Optional Keys](../../doc/Making%20Elements.md#Optional%20Keys))
         * @returns {*} parsed info
         */
        this.parse = (str, softParse = false) => {
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
                    if (itemEnd === 1) {
                        itemEnd = -1;
                    }
                } else if (str.startsWith("{")) { // dict
                    itemType = "dict";
                    itemEnd = Internal.getDictOrArrayEnd(str);
                } else if (str.startsWith("[")) { // array
                    itemType = "array";
                    itemEnd = Internal.getDictOrArrayEnd(str);
                } else if (str.startsWith("<")) { // is element
                    itemType = "element";
                    
                    itemEnd = Internal.getItemWithCutEnd(str);  
                } else if (!isNaN(str.charAt(0))) { //is number
                    itemType = "number";

                    let i = 0;
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

                    itemEnd = Internal.getItemWithCutEnd(str);  
                } else if (str.startsWith("function")) { // function
                    itemType = "function";

                    itemEnd = Internal.getItemWithCutEnd(str);  
                } else if (str.startsWith("false") || str.startsWith("true") || str.startsWith("null")) {
                    itemType = "literal";

                    itemEnd = 4;
                    if (str.startsWith("false")) {
                        itemEnd = 5;
                    }
                } else {
                    console.warn("parse Function: str type not found assuming type str");
                    console.debug(str);
                    str = `"${str}"`;
                    itemType = "str";
                    itemEnd = str.length;
                } 

                if (itemEnd === -1) {
                    console.error("parse Function: item end could not be found");
                    console.debug(str);
                    if (info.length === 1) {
                        info = info[0];
                    }
                    return info;
                }

                let item = str.slice(0, itemEnd);
                str = str.slice(itemEnd);

                if (itemType === "dict" || itemType === "array") {
                    item = Internal.softParseInfo(item);
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
                        item = Internal.parseFunction(item);
                        info.push(item);
                        break;
                    case "literal":
                        if (item === "false") {
                            info.push(false);
                        }
                        if (item === "true") {
                            info.push(true);
                        }
                        if (item === "null") {
                            info.push(null);
                        }
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
    /**
     * Append the elements to the querySelector
     * @param {string} querySelector follows the (querySelector)[https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector] syntax
     * @param {array | HTMLElement} content  HTML element or array of HTML Elements
     * @returns {void} Nothing
     */
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
            p.append(item);
        }
    }
}