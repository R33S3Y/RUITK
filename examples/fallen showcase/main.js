import { Elements } from "/ruitk/elements/elements.js";
import { TileWin } from "/ruitk/tileWin/tileWin.js";
import { FallenBase } from "/ruitk/themes/fallen/base.js";

let app = document.createElement("img");
app.src = "/ruitk/themes/fallen/wallpaper.jpg";
app.style.position = "fixed";
app.style.left = "0px";
app.style.top = "0px";
app.style.width = "100%";
app.style.height = "100%";
app.style.objectFit = "cover";
app.style.zIndex = "-1";

document.querySelector("body").appendChild(app);


let tileWin = new TileWin();
let elements = new Elements();
FallenBase.init();


tileWin.updateConfig({
    animateOnCreateTile : true,
    createInnerTile : true,
});


tileWin.updateStyle(FallenBase.getTileWinStyle());
elements.addElements(FallenBase.getElements());

tileWin.createTile("TextWindow", 1, 0, 1, 0, elements.makeElements(`
    <h1>{"text" : "h1 h1 h1 h1 h1 h1 h1"}
    <h2>{"text" : "h2 h2 h2 h2 h2 h2 h2"}
    <h3>{"text" : "h3 h3 h3 h3 h3 h3 h3"}

    <p1>{"text" : "p1 p1 p1 p1 p1 p1 p1"}
    <p2>{"text" : "p2 p2 p2 p2 p2 p2 p2"}
    <p3>{"text" : "p3 p3 p3 p3 p3 p3 p3"}
    `));
tileWin.createTile("Tile the 2nd",2,0,1,0);
tileWin.update();
