
import { TileWin } from "/ruitk/tileWin/tileWin.js";

let colors = {
    // Highlights
    activeH1 : "rgb(173, 160, 174)",
    inactiveH1 : "rgb(87, 82, 108)",
    activeH2 : "rgba(193, 143, 179, 0.8)",
    inactiveH2 : "rgba(87, 82, 108, 1)",


    // Background
    activeB1 : "rgba(70, 70, 70, 1)",
    inactiveB1 : "rgba(61, 61, 61, 0.5)",
};

let style = {
    transition: "all 2.2s ease-in-out",
    position : "absolute",
    overflow : "hidden",
    boxSizing : "border-box",
    margin : "10px",
    padding : "10px",
    
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
    hover_boxShadow: "0 0 5px 2px rgba(0, 0, 0, 1)",
    hover_borderColor : colors.activeH2,
};

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


tileWin.updateConfig({
    tileRowType : ["fixed", "scroll", "scroll"],
});
tileWin.updateStyle(style);

let test = document.createElement("h1");
test.innerText = "wshfleryjkgejgtuihregurighrwghuthjn;ourefh mwelfclhsd gwfwefsefxwsef wefc werfwerfg wf wefvd cvdvcwfe dvdefcdefefvedfv efvefved vdevdevev dmreuo 9em uhtgor";
tileWin.createTile("leftSideTop", 0, -1, 0, -1);
tileWin.createTile("leftSideBottom", 0, -1, 2, 1);

tileWin.createTile("CentreD1", 1, -1, 2, -1);
tileWin.createTile("CentreD2", 1, 1, 2, 1);
tileWin.createTile("CentreD3", 1, -1, 2, 1, test);

let text = document.createElement("h1");
text.innerText = `In the heart of an ancient forest, where the trees whispered secrets and shadows danced beneath the moonlight, there was a figure known as the Keeper of the Keys. Cloaked in a tattered robe of deep midnight blue, the Keeper moved with an uncanny grace, slipping through the forest like a wisp of smoke. No one knew where the Keeper came from, nor did they know the true purpose behind the keys he guarded.

Legends spoke of the Keeper's origins. Some said he was a fallen star, cast down from the heavens for stealing the key to the gates of paradise. Others claimed he was a sorcerer who had bargained with ancient spirits, gaining immortality in exchange for his service. But all agreed on one thing: the Keeper possessed a key for every lock, a solution for every enigma.

Hidden within a secluded grove, the Keeper's dwelling was an intricate network of tunnels and chambers carved into the roots of an ancient oak. Each chamber was filled with keys of all shapes and sizes, hanging from the walls, embedded in the ceiling, and even scattered across the floor. Some were made of gold and encrusted with jewels, while others were simple iron, rusted with age. Each key had a story, a history, and a purpose.

One moonlit night, a young woman named Elara stumbled into the grove. She was on a quest to save her village, which had been cursed by a malevolent sorcerer. The crops withered, the wells dried up, and the people were falling ill. Desperation had driven Elara deep into the forest, following whispers of a mysterious figure who held the power to break any curse.

Elara approached the Keeper’s dwelling with trepidation, her heart pounding in her chest. She called out softly, her voice trembling, "Keeper of the Keys, I seek your help."

The shadows shifted, and the Keeper appeared before her, his eyes gleaming like shards of obsidian. "What brings you to my grove, child?" he asked in a voice as smooth as silk and as cold as winter’s breath.

Elara took a deep breath and explained her plight. The Keeper listened, his expression unreadable. When she finished, he nodded slowly. "I can help you," he said, "but the solution you seek comes at a price."

"What is the price?" Elara asked, her voice barely above a whisper.

The Keeper reached into the folds of his robe and pulled out a small, silver key. It was simple yet elegant, and it seemed to shimmer with an otherworldly light. "This key will unlock the curse that plagues your village," he said. "But in return, you must leave something of great value to you here in my grove."

Elara thought for a moment. She had nothing of material value, but she knew what the Keeper truly sought. With a heavy heart, she reached into her satchel and pulled out a locket. It was a family heirloom, passed down through generations, and it held a portrait of her late parents. It was her most treasured possession.

The Keeper took the locket, his fingers brushing against hers for the briefest moment. "Very well," he said, handing her the silver key. "Go now, and may the fates be kind to you."

Elara hurried back to her village and used the key to unlock the curse. True to the Keeper's word, the crops began to flourish, the wells filled with water, and the people recovered from their ailments. The village was saved, and Elara was hailed as a hero.

But deep in the heart of the ancient forest, the Keeper of the Keys held the locket close, a faint smile playing on his lips. For in the exchange, he had gained not just a simple trinket, but a piece of Elara’s heart and a connection to a new story—a story that would live on in the whispers of the trees and the dance of the shadows.

And so, the Keeper continued his vigil, guarding his keys and weaving new tales, a sly figure in the forest who held the power to unlock the world’s deepest mysteries and bind them to his ever-growing collection.`;
tileWin.createTile("rightSide", 2, 1, 1, 0, text);

tileWin.createTile("CentreTop", 1, 0, 0, 0);

console.log(tileWin.tiles);

tileWin.update();


setTimeout(function() {
    let stuff = document.createElement("h1");
    stuff.innerHTML = "This Should Be in the Centre tile saiogvf kludzfougjfvhlkcl gjborguih riohiuebnrso;d;hvj,b jtgldfj,gikrtwerwrw efwfw fwefw fcrewrfwe jngp98j";
    
    tileWin.createTile("Centre", 1, 0, 1, 0, stuff);
    tileWin.update();
}, 1000);

