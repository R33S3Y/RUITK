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


tileWin.updateConfig({
    animateOnCreateTile : true,
    createInnerTile : true,
});

tileWin.updateStyle(theme.getTileWinStyle());
elements.addElements(theme.getElements());

tileWin.createTile("TextWindow", 1, 0, 1, 0, elements.makeElements(`
    <p1>{"text" : "p1 p1 p1 p1 p1 p1 p1"}
    `));
tileWin.createTile("help",2,0,1,0);
tileWin.update();
