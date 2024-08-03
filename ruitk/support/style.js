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
        if (typeof style !== "object" || style === null) {
            console.error("style is not dict");
            return;
        }
        if (Object.keys(style).length === 0) {
            console.warn("style dict = {}");
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

        let styleElement = document.getElementById("RUITKStyles");
        if (styleElement === null) {
            styleElement = document.createElement("style");
            styleElement.id = "RUITKStyles";
            styleElement.textContent = "\n";
            document.querySelector("body").append(styleElement);
        }
        if (styleElement.textContent.includes(`.${className}`)) { //style is already made so don't bother
            console.debug("skipped style processing");
            return element;
        }
        
        let styleText = "";

        

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

        // get hover
        let hoverStyle = getFlageditems(style, "hover");

        // everything else
        styleText += `.${className} {\n${compileStyles(style)}}\n\n`;
        
        // apply hover
        if (hoverStyle !== null) {
            if(forceOnFlags.includes("hover") === false) {
                styleText += `.${className}:hover {\n${compileStyles(hoverStyle)}}\n\n`;
            } else {
                styleText += `.${className} {\n${compileStyles(hoverStyle)}}\n\n`;
            }
            
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
}