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

        // Append to parent
        let parent = document.querySelector(p);
        if (parent) {
            parent.appendChild(tile);
        } else {
            console.error(`Parent element "${p}" not found.`);
        }
    }
    static transform(id, x, y, w, h) {
        let tile = document.getElementById(id);
        tile.style.left = x;
        tile.style.top = y;
        tile.style.width = w;
        tile.style.height = h;
    }
    static append(id, content) {
        if (!content) {
            console.warn(`content (${content}) is falsely`);
            return;
        }
        if (Array.isArray(content) === false) {
            content = [content];
        }
        let tile = document.getElementById(id);
        
        if (content) {
            for (let item of content) {
                if (typeof item === "string") {
                    tile.innerHTML += item; 
                } else if (item instanceof HTMLElement) {
                    tile.appendChild(item); 
                } else {
                    console.warn(`item (${item}) is not vaild`);
                }
            }
        }
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
    static remove(id) {
        let tile = document.getElementById(id);
        tile.innerHTML = "";
    }
    static destory(id) {
        let tile = document.getElementById(id);

        if (tile) {
            tile.remove();
        }
    }
}