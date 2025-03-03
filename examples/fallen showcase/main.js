// tools
import { Elements } from "../../ruitk/elements/elements.js";
let elements = new Elements();
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
    <tileWin>{"config" : {"tileRowType" : ["scroll", "scroll", "fixed"], tilePercentageX : [30,30,40]}, "tiles" : [
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
                    <textbox>{name : "email", "placeholder" : "Email", "c" : "1", "r" : "1"}
                    <textbox>{name : "password", "placeholder" : "Password", "c" : "1", "r" : "2"}
                    <submit>{content : "Submit", "c" : "1", "r" : "3", callback: (form) => {console.log(form)}}    
                }
        }, {    
            "name" : "Form Test",
            "x" : 2,
            "y" : 1,
            content : 
                <grid>{"cTemplate" : "auto auto", "rTemplate" : "auto auto auto" , "content" : 
                    
                    <radio>{question : "1. Test Question", options : ["yes", "no", "maybe :3"], "c" : "1", "r" : "1"}
                    <checkbox>{question : "3. Test Question", options : ["JS", "CSS", "HTML"], "c" : "2", "r" : "1"}
                    
                    <dropdown>{question : "2. Test Question", options : ["1", "2", "3"], "c" : "1", "r" : "2"}
                    <combo>{question : "4. Test Question", options : ["1", "2", "3"], "c" : "2", "r" : "2"}   

                    <button>{content : "hello World", callback : () => {console.log("Hello World! I am button!")}}
                    <search>{}
                }
                <grid>{"cTemplate" : "auto auto auto auto", "rTemplate" : "auto auto auto auto" , "content" : 
                    
                    <icon>{"c" : "1", "r" : "1"}
                }
        }
    ]}
`));
