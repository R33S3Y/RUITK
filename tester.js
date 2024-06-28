
import { TileWin } from "./tileWin/tileWin.js";

let colors = {
    // Highlights
    activeH1 : "rgb(173, 160, 174)",
    inactiveH1 : "rgb(87, 82, 108)",
    activeH2 : "rgba(193, 143, 179, 0.8)",
    inactiveH2 : "rgba(87, 82, 108, 1)",


    // Background
    activeB1 : "rgba(70, 70, 70, 1)",
    inactiveB1 : "rgba(61, 61, 61, 0.5)",
}


let style = {
    transition: "all 0.2s ease-in-out",
    position: "absolute",
    // background
    backgroundColor : colors.inactiveB1,
    backdropFilter: "blur(4px)",
    hover_backgroundColor : colors.activeB1,
    
    // border
    borderStyle : "solid",
    borderWidth : "3px",
    borderRadius : "15px",
    borderColor : colors.inactiveH2,
    boxShadow: "0 0 4px rgba(0, 0, 0, 1)",
    hover_boxShadow: "0 0 10px 2px rgba(0, 0, 0, 1)",
    hover_borderColor : colors.activeH2,
}

let app = document.createElement("img");
app.src = "wallpaper.jpg";
app.style.position = "fixed";
app.style.left = "0px";
app.style.top = "0px";
app.style.width = "100%";
app.style.height = "100%";
app.style.objectFit = "cover";
app.style.zIndex = "-1";

document.querySelector("body").appendChild(app);



let tileWin = new TileWin();

tileWin.updateStyle(style);
tileWin.updateConfig({
    tileGap : "10px",
});

tileWin.createTile("leftSideTop", "left", -1, "top", -1, null);
tileWin.createTile("leftSideBottom", "left", -1, "bottom", 1, null);
tileWin.createTile("Centre", "centre", 0, "centre", 0, null);
tileWin.createTile("rightSide", "right", 1, "centre", 0, null);

tileWin.createTile("CentreTop", "centre", 0, "top", 0, null);
tileWin.createTile("righterSide", "right", 2, "centre", 0, null);
tileWin.createTile("righterdownerSide", "right", 2, "centre", 1, null);

console.log(tileWin.tiles);

tileWin.renderTiles();


setTimeout(function() {
    tileWin.createTile("CentreD", "centre", 0, "bottom", 0, null);
    tileWin.renderTiles();
}, 1000);