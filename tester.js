import { Tile } from "./tileWin/tile.js";

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
    // background
    backgroundColor : colors.inactiveB1,
    backdropFilter: "blur(4px)",
    hover_backgroundColor : colors.activeB1,
    
    // border
    borderStyle : "solid",
    borderWidth : "3px",
    borderRadius : "10px",
    borderColor : colors.inactiveH2,
    boxShadow: "0 0 4px rgba(0, 0, 0, 1)",
    hover_boxShadow: "0 0 10px 2px rgba(0, 0, 0, 1)",
    hover_borderColor : colors.activeH2,
}

let app = document.createElement("img");
app.src = "wallpaper.jpg";
app.style.position = "absolute";
app.style.left = "0px";
app.style.top = "0px";
app.style.width = "100%";
app.style.height = "100%";
app.style.objectFit = "cover";
app.style.zIndex = "-1";

document.querySelector("body").appendChild(app);

Tile.create(0, "50px", "20px", "200px", "100px", style);

Tile.create(1, "200px", "300px", "500px", "300px", style);

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight') {
        Tile.create(2, "850px", "650px", 0, 0, style);
        setTimeout(() => {
            Tile.transform(2, "800px", "600px", "100px", "100px");
        }, 0); // Delay in milliseconds
    }
});