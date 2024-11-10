// tools
import { Elements } from "/ruitk/elements/elements.js";
let elements = new Elements();
// styles
import { FallenBase } from "/ruitk/themes/fallen/base.js";
import { FallenTileWin } from "/ruitk/themes/fallen/tileWin.js";
import { FallenInput } from "/ruitk/themes/fallen/input.js";


elements.addElements(FallenBase.getElements());
elements.addElements(FallenTileWin.getElements());
elements.addElements(FallenInput.getElements());

elements.append("body", elements.makeElements(`
    <backgroundImg>{}
    <tileWin>{"config" : {"tileRowType" : ["scroll", "scroll", "fixed"], tilePercentageX : [30,40,30]}, "tiles" : [
        {    
            "name" : "TextWindow",
            "x" : 1,
            "y" : 1,
            "content" : 
                <grid>{"cTemplate" : "auto auto", "rTemplate" : "auto auto auto auto auto auto" , "content" : 
                    <h1>{"content" : "h1 h1 h1 h1 h1 h1 h1", "c" : "1", "r" : "1"}
                    <h2>{"content" : "h2 h2 h2 h2 h2 h2 h2", "c" : "1", "r" : "2"}
                    <h3>{"content" : "h3 h3 h3 h3 h3 h3 h3", "c" : "1", "r" : "3"}

                    <p1>{"content" : "p1 p1 p1 p1 p1 p1 p1", "c" : "1", "r" : "4"}
                    <p2>{"content" : "p2 p2 p2 p2 p2 p2 p2", "c" : "1", "r" : "5"}
                    <p3>{"content" : "p3 p3 p3 p3 p3 p3 p3", "c" : "1", "r" : "6"}
                    
                    <h1>{"content" : <a>{"content" : "Link", "href" : "https://www.example.com"} <b>{"content" : " Bold "} <u>{"content" : "UnderLine"} <i>{"content" : " italic "}, "textAlign" : "right", "c" : "2", "r" : "1"}
                    <h2>{"content" : <a>{"content" : "Link", "href" : "https://www.example.com"} <b>{"content" : " Bold "} <u>{"content" : "UnderLine"} <i>{"content" : " italic "}, "textAlign" : "right", "c" : "2", "r" : "2"}
                    <h3>{"content" : <a>{"content" : "Link", "href" : "https://www.example.com"} <b>{"content" : " Bold "} <u>{"content" : "UnderLine"} <i>{"content" : " italic "}, "textAlign" : "right", "c" : "2", "r" : "3"}

                    <p1>{"content" : <a>{"content" : "Link", "href" : "https://www.example.com"} <b>{"content" : " Bold "} <u>{"content" : "UnderLine"} <i>{"content" : " italic "}, "textAlign" : "right", "c" : "2", "r" : "4"}
                    <p2>{"content" : <a>{"content" : "Link", "href" : "https://www.example.com"} <b>{"content" : " Bold "} <u>{"content" : "UnderLine"} <i>{"content" : " italic "}, "textAlign" : "right", "c" : "2", "r" : "5"}
                    <p3>{"content" : <a>{"content" : "Link", "href" : "https://www.example.com"} <b>{"content" : " Bold "} <u>{"content" : "UnderLine"} <i>{"content" : " italic "}, "textAlign" : "right", "c" : "2", "r" : "6"}
                }
        }, {    
            "name" : "InputTest",
            "x" : 1,
            "y" : 2,
            "content" :
                <h1>{"content" : "Sign in", "textAlign" : "center"}
                <grid>{"cTemplate" : "auto", "rTemplate" : "auto auto auto" , "content" : 
                    <textbox>{"placeholder" : "Email", "c" : "1", "r" : "1"}
                    <textbox>{"placeholder" : "Password", "c" : "1", "r" : "2"}
                    <submit>{"c" : "1", "r" : "3"}    
                }
        }, {    
            "name" : "Tile the 2nd",
            "x" : 2,
            "y" : 1,
            content : 
                <grid>{"cTemplate" : "auto auto", "rTemplate" : "auto auto auto auto auto auto" , "content" : 
                    <radio>{"content" : "h1 h1 h1 h1 h1 h1 h1", "c" : "1", "r" : "1"}
                    <radio>{"content" : "h2 h2 h2 h2 h2 h2 h2", "c" : "1", "r" : "2"}
                    <radio>{"content" : "h3 h3 h3 h3 h3 h3 h3", "c" : "1", "r" : "3"}

                    <checkbox>{"content" : "p1 p1 p1 p1 p1 p1 p1", "c" : "1", "r" : "4"}
                    <checkbox>{"content" : "p2 p2 p2 p2 p2 p2 p2", "c" : "1", "r" : "5"}
                    <checkbox>{"content" : "p3 p3 p3 p3 p3 p3 p3", "c" : "1", "r" : "6"}

                    <dropdown>{options : ["1", "2", "3"], "c" : "2", "r" : "1"}

                    <combo>{options : ["1", "2", "3"], "c" : "2", "r" : "4"}
                }
        }
    ]}
`));
