// tools
import { Elements } from "/ruitk/elements/elements.js";
import { TileWin } from "/ruitk/tileWin/tileWin.js";

let tileWin = new TileWin();
let elements = new Elements();



// styles
import { FallenBase } from "/ruitk/themes/fallen/base.js";
import { FallenTileWin } from "/ruitk/themes/fallen/tileWin.js";
import { FallenInput } from "/ruitk/themes/fallen/input.js";

FallenBase.init();
elements.addElements(FallenBase.getElements());
elements.addElements(FallenTileWin.getElements());
elements.addElements(FallenInput.getElements());


elements.append("body", elements.makeElements(`<backgroundImg>{}`));

tileWin.createTile("TextWindow", 1, 0, 0, 0, elements.makeElements(`
    <tile>{"content" : 
        <grid>{"c" : "auto auto", "r" : "auto auto auto auto auto auto" , "content" : 
            <h1>{"content" : "h1 h1 h1 h1 h1 h1 h1", "c" : "1", "r" : "1"}
            <h2>{"content" : "h2 h2 h2 h2 h2 h2 h2", "c" : "1", "r" : "2"}
            <h3>{"content" : "h3 h3 h3 h3 h3 h3 h3", "c" : "1", "r" : "3"}

            <p1>{"content" : "p1 p1 p1 p1 p1 p1 p1", "c" : "1", "r" : "4"}
            <p2>{"content" : "p2 p2 p2 p2 p2 p2 p2", "c" : "1", "r" : "5"}
            <p3>{"content" : "p3 p3 p3 p3 p3 p3 p3", "c" : "1", "r" : "6"}
            
            <h1>{"content" : <b>{"content" : "Bold"} <i>{"content" : " italic"}, "textAlign" : "right", "c" : "2", "r" : "1"}
            <h2>{"content" : <b>{"content" : "Bold"} <i>{"content" : " italic"}, "textAlign" : "right", "c" : "2", "r" : "2"}
            <h3>{"content" : <b>{"content" : "Bold"} <i>{"content" : " italic"}, "textAlign" : "right", "c" : "2", "r" : "3"}

            <p1>{"content" : <b>{"content" : "Bold"} <i>{"content" : " italic"}, "textAlign" : "right", "c" : "2", "r" : "4"}
            <p2>{"content" : <b>{"content" : "Bold"} <i>{"content" : " italic"}, "textAlign" : "right", "c" : "2", "r" : "5"}
            <p3>{"content" : <b>{"content" : "Bold"} <i>{"content" : " italic"}, "textAlign" : "right", "c" : "2", "r" : "6"}
        }
    }   
`));
/*
tileWin.createTile("InputTest", 1, 0, 2, 0, elements.makeElements(`
    <tile>{"content" : 
        <h1>{"content" : "Sign in", "textAlign" : "center"}
        <textbox>{"f" : "signInForm", "name" : "email", "placeholder" : "enter Your Email", "title" : "Email"}
        <textbox>{"f" : "signInForm", "name" : "password", "placeholder" : "enter Your Password", "title" : "Password"}
        <submit>{"f" : "signInForm", "content" : "Sign In", "onClick", "callbackFunction that I'm to lazy to write"}
    }
`));
*/
tileWin.createTile("Tile the 2nd", 2, 0, 1, 0, elements.makeElements(`<tile>{}`));
tileWin.updateTest();
