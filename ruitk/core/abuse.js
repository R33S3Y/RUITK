import { Ruitk } from "./core.js";
import { Internal } from "./internal.js";

Ruitk.prototype.abuse = function () {

    console.debug("abuse Function: Starting tests...");
    
    let elements = this.elements;
    this.elements = [];

    this.initFunctions();

    console.debug("abuse Function: Starting Minimal dependency test");
    
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        console.debug(`abuse Function: Testing "${element.name}"`);
        
        let dependencyNames = Internal.getElementDependencysList(element, elements);
        let dependencyElements = [];
        for (let dependencyName of dependencyNames) {
            let temp = Internal.getElementByName(dependencyName, elements);
            if (temp === null) {
                continue;
            }
            dependencyElements.push(temp);
        }
        for (let dependencyElement of dependencyElements) {
            dependencyElement = Internal.resolveElementObject(dependencyElement, elements);
        }

        this.addElements(dependencyElements);
        this.addElements(element);

        this.initFunctions();
        
        
        try {
            this.append("body", this.makeElements(`<${element.name}>{}`));
        } catch {
            console.error(`abuse function: Failed to render/use element: "${element.name}" with minamal dependancys`);
        }
        
        this.elements = [];

        // RM -rf everything in the body except RUITKStyles
        let style = document.getElementById("RUITKStyles");
        document.querySelector("body").replaceChildren(style);
    }

    console.debug("abuse Function: Finshed Minimal dependency test");


    this.elements = elements;
    this.initFunctions();    
    return true;
};