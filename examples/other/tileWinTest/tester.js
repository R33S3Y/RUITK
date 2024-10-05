// this test should do a bunch of tile configs which should cover 100% of the screen in light gray
// if any part of the screen is white or dark grey something is broken 

import { TileWin } from "/ruitk/tileWin/tileWin.js";

let style = {
    overflow : "hidden",
    boxSizing : "border-box",
    margin : "0px",
    
    // background
    backgroundColor : "rgba(128, 128, 128, 0.75)",
    
    // border
    borderStyle : "none",
};

let app = document.createElement("div");
app.style.position = "fixed";
app.style.left = "0px";
app.style.top = "0px";
app.style.width = "100%";
app.style.height = "100%";
app.style.objectFit = "cover";
app.style.zIndex = "-1";
app.style.backgroundColor = "rgb(255, 255, 255)";

document.querySelector("body").appendChild(app);

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}





let tileWin = new TileWin();
tileWin.updateStyle(style);




// test 1

tileWin.updateConfig({
    tileRowType : ["scroll", "fixed", "scroll"],
});
tileWin.createTile("1", 1, 1); 
tileWin.update();

await wait(1000);

tileWin.destoryAll();
tileWin.update();

// needs to be expanded