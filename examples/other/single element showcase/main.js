// tools
import { Elements } from "/ruitk/elements/elements.js";
import { TileWin } from "/ruitk/tileWin/tileWin.js";

let tileWin = new TileWin();
let elements = new Elements();

// styles
import { FallenBase } from "/ruitk/themes/fallen/base.js";
import { FallenTileWin } from "/ruitk/themes/fallen/tileWin.js";
import { FallenInput } from "/ruitk/themes/fallen/input.js";


elements.addElements(FallenBase.getElements());
elements.addElements(FallenTileWin.getElements());
elements.addElements(FallenInput.getElements());




let app = document.createElement("div");
app.style.position = "fixed";
app.style.left = "0px";
app.style.top = "0px";
app.style.width = "100%";
app.style.height = "100%";
app.style.objectFit = "cover";
app.style.zIndex = "-1";
app.style.backgroundColor = "rgb(0, 0, 0)";

document.querySelector("body").appendChild(app);


elements.append("body", elements.makeElements(`
    <h1>{"xAline" : "center", "yAline" : "center", "content" : "example123"}  
`));
