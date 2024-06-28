import { Style } from "./style.js";

export class Tile {
    static create(id, x = "100px", y = "100px", w = "100px", h = "100px", style, p = "body") {

        let tile = document.createElement("div");
        tile.id = id;

        tile = Style.style(tile, style);

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
        Style.style(tile, style);
    }
    static getInfo(id) {
        let tile = document.getElementById(id);
        let info = {
            x : tile.style.left,
            y : tile.style.top,
            w : tile.style.width,
            h : tile.style.height
        }
    }

}