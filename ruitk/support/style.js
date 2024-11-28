import { Merge } from "./merger.js";
import { Convert } from "./convert.js";

export class Style {
    static style(element, style, forceOnFlags = "") {
        function sortObjectKeys(obj) {
            // Sort keys alphabetically
            const sortedKeys = Object.keys(obj).sort();
            
            // Create a new object with sorted keys
            const sortedObj = {};
            for (let key of sortedKeys) {
                sortedObj[key] = obj[key];
            }
            
            return sortedObj;
        }
        function hashCode(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                let character = str.charCodeAt(i);
                hash = (hash << 5) - hash + character;
                hash = hash & hash; // Convert to 32bit integer
            }
            return hash;
        }
        function mapNumbersToLetters(str) {
            // Define a mapping for numbers to letters
            str = `${str}`;
            let numberToLetterMap = {
                '0': 'A', '1': 'B', '2': 'C', '3': 'D', '4': 'E',
                '5': 'F', '6': 'G', '7': 'H', '8': 'I', '9': 'J', '-': 'K'
            };
        
            // Initialize the result as an empty string
            let result = '';
        
            // Iterate through each character in the input string
            for (let char of str) {
                // If the character is a digit, map it to a letter
                if (numberToLetterMap[char] !== undefined) {
                    result += numberToLetterMap[char];
                } else {
                    // If the character is not a digit, keep it unchanged
                    result += char;
                }
            }
        
            return result;
        }
        function getFlageditems(style, flag) {
            let flagStyle = null;
            if (flag in style) {
                flagStyle = JSON.parse(JSON.stringify(style[flag]));
                delete style[flag];
            }
            for (let property in style) {
                // hover
                if (property.includes(`${flag}_`)) {
                    if (flagStyle === null) {
                        flagStyle = {};
                    }
                    flagStyle[property.replace(`${flag}_`,"")] = style[property];
                    delete style[property];
                }
            }
            return flagStyle;
        }
        function compileStyles(style) {
            let cssStyles = ""
            for(let key in style) {
                let styleName = "";
                for(let char of key) {
                    if(char === char.toUpperCase() && char !== char.toLowerCase()) { // if isuppercase
                        char = `-${char.toLowerCase()}`;
                    }
                    styleName += char
                }
                cssStyles += `\t${styleName}: ${style[key]};\n`;
            }
            return cssStyles;
        }

    
        if (Array.isArray(style) === true) { // Allows us to pass in array of mutiple styles at once
            let mergedStyle = {};
            for (let subStyle of style) {
                mergedStyle = Merge.dicts(subStyle, mergedStyle, []);
            }
            style = mergedStyle;
        }

        if (typeof style !== "object" || style === null) {
            console.error("style is not dict");
            return;
        }
        if (Object.keys(style).length === 0) {
            console.warn("style dict = {}");
            return;
        }
        if (!element) {
            console.error("element is falsey");
            return;
        }

        // forceOnFlags processing
        if (Array.isArray(forceOnFlags) === false) {
            if (typeof forceOnFlags !== "string") {
                console.warn("forceOnFlags invaild! ignoring");
                forceOnFlags = "";
            }
            forceOnFlags = [forceOnFlags];
        }

        style = JSON.stringify(sortObjectKeys(style), null, 1);
        let className = hashCode(`${style}${JSON.stringify(forceOnFlags)}`);
        className = mapNumbersToLetters(className);
        style = JSON.parse(style);

        element.className = className;

        let styleElement = getStyleElement();

        // js Hover
        let jsHoverFlags = getFlageditems(style, "jsHover");
        if (!forceOnFlags.includes("jsHover")) {
            if (jsHoverFlags) {
                // Add hover effect
                element.addEventListener('mouseenter', () => {
                    Object.assign(element.style, jsHoverFlags);
                });

                element.addEventListener('mouseleave', () => {
                    for (let key in jsHoverFlags) {
                        element.style[key] = "";
                    }
                });
            }
        }

        if (styleElement.textContent.includes(`.${className}`)) { //style is already made so don't bother
            console.debug("style Function: skipped duplicate style processing");
            return element;
        }
        
        

        // landscape true
        if(this.isLandscape() === true || forceOnFlags.includes("landscape") === true) {
            Object.assign(style, getFlageditems(style, "landscape"));
        }
        // landscape false
        if(this.isLandscape() === false && forceOnFlags.includes("landscape") === false) {
            getFlageditems(style, "landscape");
        }

        // portrait true
        if(this.isPortrait() === true || forceOnFlags.includes("portrait") === true) {
            Object.assign(style, getFlageditems(style, "portrait"));
        }
        // portrait false
        if(this.isPortrait() === false && forceOnFlags.includes("portrait") === false) {
            getFlageditems(style, "portrait");
        }

        // js Hover
        if (forceOnFlags.includes("jsHover")) {
            style = Merge.dicts(style, jsHoverFlags);
        }

        /**
         * The reason why we have a seprate get & apply phases for flags like hover is because when:
         * 
         * forceOnFlags.includes("hover") === true
         * 
         * we need to overwrite the flagless css. CSS will set the style to be whatever was stated last, 
         * meaning we can overwrite just by apply the hover styles last. 
         * But we need to remove all styles with flags before we can apply the main styles, so we do get first.
         * 
         * To all one person who will read this, your welcome future r33s3y.
         */
        let pseudoElements = [
            // Pseudo-Classes
            "hover",              // Matches elements when hovered
            "active",             // Matches elements when active
            "focus",              // Matches elements when focused
            "visited",            // Matches visited links
            "link",               // Matches unvisited links
            "first-child",        // Matches the first child of an element
            "last-child",         // Matches the last child of an element
            //"nth-child(n)",       // Matches the nth child of an element
            //"nth-last-child(n)",  // Matches the nth child from the end
            "only-child",         // Matches elements that are the only child
            "empty",              // Matches elements with no children
            //"not(selector)",      // Matches elements not matching the selector
            "checked",            // Matches checked input elements
            "enabled",            // Matches enabled input elements
            "disabled",           // Matches disabled input elements
            "root",               // Matches the root element of the document
            "target",             // Matches an element targeted by the URL fragment
            "first-of-type",      // Matches the first element of its type
            "last-of-type",       // Matches the last element of its type
            //"nth-of-type(n)",     // Matches the nth element of its type
            //"nth-last-of-type(n)",// Matches the nth element of its type from the end
            "only-of-type",       // Matches elements that are the only of their type
            "valid",              // Matches input elements with valid values
            "invalid",            // Matches input elements with invalid values
            "in-range",           // Matches inputs within the specified range
            "out-of-range",       // Matches inputs outside the specified range
            "required",           // Matches required input elements
            "optional",           // Matches optional input elements
            "read-only",          // Matches read-only elements
            "read-write",         // Matches editable elements

            // Pseudo-Elements (Double-Colon Syntax)
            "before",
            "after",
            "first-line",
            "first-letter",
            "placeholder",
            "selection",
            "marker",
            "backdrop",
            "cue",
            "spelling-error",
            "grammar-error",
        ];
        let specialPseudoElements = [
            "after",
            "before",
            "first-letter",
            "first-line",
            "placeholder",
            "selection",
            "marker",
            "backdrop",
            "cue",
            "spelling-error",
            "grammar-error",
            //"part(name)",          // Shadow DOM
            //"slotted(selector)",   // Shadow DOM
            "view-transition-group",     // View Transitions API
            "view-transition-image-pair", // View Transitions API
            "view-transition-old",        // View Transitions API
            "view-transition-new"         // View Transitions API
        ];

        let partlyCompiled = {};
        function makeFlagStr (flags) {
            let flagStr = "";
            for (let flag of flags) {
                flag = Convert.convert(flag, "dashedCase");
                if (specialPseudoElements.includes(flag)) {
                    flagStr += `::${flag}`;
                } else {
                    flagStr += `:${flag}`;
                }
            }
            return flagStr;
        }
        // stage 1 of 2: in key flags
        for (let key of Object.keys(style)) {
            let flags = key.split("_");
            let styleName = flags.pop();
            if (styleName.includes(pseudoElements)) {
                flags.push(styleName);
                let flagStr = makeFlagStr(flags);
                if (partlyCompiled[`.${className}${flagStr}`] === undefined) {
                    partlyCompiled[`.${className}${flagStr}`] = [];
                }
                for (let styleKey of Object.keys(style[key])) {
                    partlyCompiled[`.${className}${flagStr}`].push(`${Convert.convert(styleKey, "dashedCase")} : ${style[key][styleKey]};`);
                }
            } else {
                let flagStr = makeFlagStr(flags);
                if (partlyCompiled[`.${className}${flagStr}`] === undefined) {
                    partlyCompiled[`.${className}${flagStr}`] = [];
                }
                partlyCompiled[`.${className}${flagStr}`].push(`${Convert.convert(styleName, "dashedCase")} : ${style[key]};`);
            }
        }
        // stage 2 of 2:
        let styleText = ""; 
        for (let key of Object.keys(partlyCompiled)) {
            let areaStr = `${key} {\n`;
            for (let style of partlyCompiled[key]) {
                areaStr += `    ${style}\n`;
            }
            areaStr += "}\n";
            console.debug(areaStr);
            styleText += areaStr;
        }
        
        styleElement.textContent += styleText;
        return element;
    }

    static query(value, style) {
        if (!style) {
            console.error("style input not valid on doesn't exist")
            return;
        }

        let forceOnFlags = value.split("_");
        value = forceOnFlags[forceOnFlags.length-1];
        forceOnFlags.splice(forceOnFlags.length-1, 1);
        if (forceOnFlags.length === 0) {
            forceOnFlags.push("");
        }

        // should have hover support - Has hover support now!!!
        let element = Style.style(document.createElement("div"), style, forceOnFlags);
        // Append the element to the document body to ensure styles are applied
        document.body.appendChild(element);

        // Get the computed styles of the element
        let computedStyles = getComputedStyle(element);

        // Retrieve the value of the specified CSS property
        let result = computedStyles[value];

        // Clean up: remove the temporary element from the document
        document.body.removeChild(element);
        
        return result;
    }

    static isPortrait() {
        return window.innerHeight > window.innerWidth;
    }
    
    static isLandscape() {
        return window.innerWidth >= window.innerHeight;
    }

    static declare(vars) {
        let styleElement = getStyleElement();
        let varsDict = {};

        if (styleElement.textContent.includes(":root")) { //style is already made so don't bother
            let rootMatch = styleElement.textContent.match(/:root\s*\{[^}]*\}/);

            let rootContent = rootMatch[0];

            let varRegex = /--([\w-]+)\s*:\s*([^;]+);/g;
            let match;

            while ((match = varRegex.exec(rootContent)) !== null) {
                let varName = match[1].trim();
                let varValue = match[2].trim();
                varsDict[varName] = varValue;
            }
        }

        varsDict = Merge.dicts(varsDict, vars);

        let rootContent = ":root {\n";
  
        // Loop through the dictionary and add each variable to the root block
        for (const [key, value] of Object.entries(varsDict)) {
            rootContent += `  --${key}: ${value};\n`;
        }
        rootContent += "}\n";


        let rootMatch = styleElement.textContent.match(/:root\s*\{[^}]*\}/);
        if (rootMatch) {
            // Replace the existing :root block with the new one
            styleElement.textContent = styleElement.textContent.replace(rootMatch[0], rootContent);
        } else {
            // If no :root block exists, append the new one at the end
            styleElement.textContent += `\n${rootContent}`;
        }
    }
}

function getStyleElement() {
    let styleElement = document.getElementById("RUITKStyles");
    if (styleElement === null) {
        styleElement = document.createElement("style");
        styleElement.id = "RUITKStyles";
        styleElement.textContent = "\n";
        document.querySelector("body").append(styleElement);
    }
    return styleElement;
}