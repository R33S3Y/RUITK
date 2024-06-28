export class Style {
    static style(element, style) {
        style = JSON.parse(JSON.stringify(style));
        // Subdict extract
        // hover
        let hoverStyle = null;
        if ("hover" in style) {
            hoverStyle = JSON.parse(JSON.stringify(style.hover));
            delete style.hover;
        }
        
        // Inline extract
        for (let property in style) {
            // hover
            if (property.startsWith("hover_")) {
                if (hoverStyle === null) {
                    hoverStyle = {};
                }
                hoverStyle[property.replace("hover_","")] = style[property];
                delete style[property];
            }
        }


        for (let property in style) {
            element.style[property] = style[property];
        }

        if (hoverStyle !== null) {
            element.addEventListener("mouseover", () => {
                for (let property in hoverStyle) {
                    element.style[property] = hoverStyle[property];
                }
            });
    
            element.addEventListener("mouseout", () => {
                for (let property in style) {
                    element.style[property] = style[property];
                }
            });
        }
        
        return element;
    }

    static query(value, style) {
        if (!style) {
            console.error("style input not valid on doesn't exist")
            return
        }
        //should have hover_ support
        let element = Style.style(document.createElement("div"), style);
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
}