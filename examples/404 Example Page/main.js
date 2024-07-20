import { Elements } from "/ruitk/elements/elements.js";
import { TileWin } from "/ruitk/tileWin/tileWin.js";
import { Theme } from "/ruitk/themes/fallen/fallen.js";

let app = document.createElement("img");
app.src = "/ruitk/themes/fallen/wallpaper.jpg";
app.style.position = "fixed";
app.style.left = "0px";
app.style.top = "0px";
app.style.width = "100%";
app.style.height = "100%";
app.style.objectFit = "cover";
app.style.zIndex = "-2";

document.querySelector("body").appendChild(app);


let tileWin = new TileWin();
let elements = new Elements();
let theme = new Theme();

elements.addElements(theme.getElements());

tileWin.createTile("404Window", 1, 0, 1, 0, elements.makeElements(`
    <backgroundTile>{}
    <text1>{"text" : "You fall deeper and deeper into the abyss. Searching... But unfortunely, your efforts seem futile."}
    `));
tileWin.renderTiles();
