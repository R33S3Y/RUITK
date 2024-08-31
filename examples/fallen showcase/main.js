import { Elements } from "/ruitk/elements/elements.js";
import { TileWin } from "/ruitk/tileWin/tileWin.js";
import { FallenBase } from "/ruitk/themes/fallen/base.js";

let tileWin = new TileWin();
let elements = new Elements();
FallenBase.init();

tileWin.updateStyle(FallenBase.getTileWinStyle());
elements.addElements(FallenBase.getElements());

elements.append(elements.makeElements(`<backgroundImg>{}`), "body");

tileWin.createTile("TextWindow", 1, 0, 1, 0, elements.makeElements(`
    <h1>{"content" : "h1 h1 h1 h1 h1 h1 h1"}
    <h2>{"content" : "h2 h2 h2 h2 h2 h2 h2"}
    <h3>{"content" : "h3 h3 h3 h3 h3 h3 h3"}

    <p1>{"content" : "p1 p1 p1 p1 p1 p1 p1 " <b>{"content" : "Bold", "textAline : "right"}}
    <p2>{"content" : "p2 p2 p2 p2 p2 p2 p2"}
    <p3>{"content" : "p3 p3 p3 p3 p3 p3 p3"}
    `));
tileWin.createTile("Tile the 2nd",2,0,1,0);
tileWin.update();
