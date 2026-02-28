import { Ruitk } from "./core.js";
import { Dependencies } from "./dependencies.js";

/**
 * Tests every element to see what happens when it is run with the minimum amount of dependencys
 */
Ruitk.prototype.isolationTest = function () {

    console.debug("isolationTest Function: Starting tests...");
    
    let elements = this.elements;
    this.elements = [];

    this.initFunctions();
    
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        console.debug(`isolationTest Function: Testing "${element.name}"`);
        
        let dependencyElements = Dependencies.getAll(element, elements);
        for (let dependencyElement of dependencyElements) {
            dependencyElement = Dependencies.resolveAll(dependencyElement, elements);
        }

        if (dependencyElements.length !== 0) {
            let str = `isolationTest Function: Adding the following dependedcies:`
            for (let dependencyElement of dependencyElements) {
                str += ` "${dependencyElement.name}",`;
            }
            console.debug(str);
        }

        this.elements = this.elements.concat(dependencyElements);
        this.elements = this.elements.concat(element);

        this.initFunctions();
        
        try {
            this.append("body", this.makeElements(`<${element.name}>{}`));
        } catch {
            console.error(`isolationTest function: Failed to render/use element: "${element.name}" with minamal dependancys`);
        }
        
        this.elements = [];

        // RM -rf everything in the body except RUITKStyles
        let style = document.getElementById("RUITKStyles");
        document.querySelector("body").replaceChildren(style);
    }

    console.debug("isolationTest Function: Finshed tests");


    this.elements = elements;
    this.initFunctions();    
};

Ruitk.prototype.dependencyTest = function () {
    
};