export class Tile {
    static __style(tile, style) {
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


        // needed values
        tile.style.position = "absolute";
        tile.style.overflow = "hidden";
        
        return tile;
    }
    static create(id, x = "100px", y = "100px", w = "100px", h = "100px", style, p = "body") {
        style = JSON.parse(JSON.stringify(style));

        let tile = document.createElement("div");
        tile.id = id;

        tile = this.__style(tile, style);

        // sizing and pos
        tile.style.left = x;
        tile.style.top = y;
        tile.style.width = w;
        tile.style.height = h;

        document.querySelector(p).appendChild(tile);
    }
    static transform(id, x, y, w, h) {
        let tile = document.getElementById(id);
        tile.style.left = x;
        tile.style.top = y;
        tile.style.width = w;
        tile.style.height = h;
    }
    static append(id, item) {
        let tile = document.getElementById(id);
        tile.appendChild(item);
    }
    static restyle(id, style) {
        let tile = document.getElementById(id);
        this.__style(tile, style);
    }

}