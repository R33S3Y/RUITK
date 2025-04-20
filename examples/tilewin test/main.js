
import { Elements } from "../../ruitk/elements/elements.js";
import { TileWin } from "../../ruitk/tileWin/tileWin.js";

let elements = new Elements();
let tileWin = new TileWin();
// styles
import { FallenBase } from "../../ruitk/themes/fallen/base.js";
import { FallenTileWin } from "../../ruitk/themes/fallen/tileWin.js";
import { FallenInput } from "../../ruitk/themes/fallen/input.js";
import { FallenStaging } from "../../ruitk/themes/fallen/staging.js";


elements.addElements(FallenBase.getElements());
elements.addElements(FallenTileWin.getElements());
elements.addElements(FallenInput.getElements());
elements.addElements(FallenStaging.getElements());


elements.append("body", elements.makeElements(`
    <backgroundImg>{}
`));

tileWin.updateConfig({
    tileRowType : ["scroll"], 
    tilePercentageX : [50,50],
    tilePercentageY : [100],
});

tileWin.createTile("1", 0, 1, elements.makeElements(`
    <tile>{ 
        content :  <h1>{content : "test 1"}
    }
`));

tileWin.createTile("2", 0, 2, elements.makeElements(`
    <tile>{ 
        content :  <h1>{content : "test 2"}
    }
`));

tileWin.update();

let delay = ms => new Promise(res => setTimeout(res, ms));
await delay(5000);

tileWin.move("2", 0, 0);
tileWin.update();

console.log(tileWin.info());
console.log(tileWin.info("2"));
