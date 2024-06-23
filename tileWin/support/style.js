export class Style {
    static style(tile, style) {
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
            tile.style[property] = style[property];
        }

        if (hoverStyle !== null) {
            tile.addEventListener("mouseover", () => {
                for (let property in hoverStyle) {
                    tile.style[property] = hoverStyle[property];
                }
            });
    
            tile.addEventListener("mouseout", () => {
                for (let property in style) {
                    tile.style[property] = style[property];
                }
            });
        }
        
        return tile;
    }
}