import { Console } from "../support/console.js";
import { Ruitk } from "./core.js";
import { Dependencies } from "./dependencies.js";

/**
 * Tests every element to see what happens when it is run with the minimal amount of dependencys
 */
Ruitk.prototype.minimalDependacyTest = function () {

    console.debug("minimalDependacyTest Function: Starting tests...");
    
    let elements = this.elements;
    this.elements = [];

    this.initFunctions();
    
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        console.debug(`minimalDependacyTest Function: Testing "${element.name}"`);
        
        let dependencyElements = Dependencies.getAll(element, elements);
        for (let dependencyElement of dependencyElements) {
            dependencyElement = Dependencies.resolveAll(dependencyElement, elements);
        }

        if (dependencyElements.length !== 0) {
            let str = `minimalDependacyTest Function: Adding the following dependedcies:`
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
            console.error(`minimalDependacyTest function: Failed to render/use element: "${element.name}" with minamal dependancys`);
        }
        
        this.elements = [];

        // RM -rf everything in the body except RUITKStyles
        let style = document.getElementById("RUITKStyles");
        document.querySelector("body").replaceChildren(style);
    }

    console.debug("minimalDependacyTest Function: Finshed tests");


    this.elements = elements;
    this.initFunctions();    
};

Ruitk.prototype.dependencyHandlingTest = function () {
    function assert(testName, condition) {
        try {
            if (condition) {
                console.debug(`dependencyHandlingTest Function: ${testName} passed.`);
            } else {
                Console.dump();
                console.error(`dependencyHandlingTest Function: ${testName} failed.`);
            }
        } catch {
            Console.dump();
            console.error(`dependencyHandlingTest Function: ${testName} failed.`);
        }
    }
    
    console.debug("dependencyHandlingTest Function: Starting tests...");

    let result = {};
    let elements = [];

    elements = [{
        name : "a",
        thing1 : "thing1",
    }, {
        name : "b",
        thing1 : "<a>",
    }];
    result = Dependencies.resolve(elements[1], "thing1", elements);
    assert("resolve test", (result.thing1 === "thing1"));

    elements = [{
        name : "a",
        thing1 : "thing1",
        thing2 : "thing2",
    }, {
        name : "b",
        thing1 : "<a>",
        thing2 : "<a>",
    }];
    result = Dependencies.resolveAll(elements[1], elements);
    assert("resolveAll test", (result.thing1 === "thing1" && result.thing2 === "thing2"));


    
    elements = [{
        name : "a",
        thing1 : "<b>",
    }];
    Console.take();
    Console.muted = true;
    result = Dependencies.resolve(elements[0], "thing1", elements);
    Console.free();
    assert("resolve to missing element test", (Console.store.error[0].includes(`Failed to find Element: "b"`)));
    Console.clear();

    elements = [{
        name : "a",
        thing1 : "<b>",
    }, {
        name : "b",
    }];
    Console.take();
    Console.muted = true;
    result = Dependencies.resolve(elements[0], "thing1", elements);
    Console.free();
    assert("resolve to undefined key test", (Console.store.error[0].includes(`key: "thing1" is undefined in Element: "a".`)));
    Console.clear();






    elements = [{
        name : "a",
        thing1 : "<b>",
    }, {
        name : "b",
        thing1 : "thing1",
    }];
    result = Dependencies.get(elements[0], elements);
    assert("referencing syntax get test", (result[0].name === "b"));

    elements = [{
        name : "a",
        thing1 : "<b>",
    }, {
        name : "b",
        thing1 : "<c>",
    }, {
        name : "c",
        thing1 : "thing1",
    }];
    result = Dependencies.getAll(elements[0], elements);
    assert("referencing syntax getAll test", ((result[0].name === "b" && result[1].name === "c") || (result[0].name === "c" && result[1].name === "b")));


    
    elements = [{
        name : "a",
        dependencies : ["b"],
    }, {
        name : "b",
    }];
    result = Dependencies.get(elements[0], elements);
    assert("dependencies array syntax get test", (result[0].name === "b"));

    elements = [{
        name : "a",
        dependencies : "b",
    }, {
        name : "b",
    }];
    result = Dependencies.get(elements[0], elements);
    assert("dependencies string syntax get test", (result[0].name === "b"));

    elements = [{
        name : "a",
        dependencies : ["b"],
    }, {
        name : "b",
        dependencies : "c",
    }, {
        name : "c",
    }];
    result = Dependencies.getAll(elements[0], elements);
    assert("dependencies syntax getAll test", ((result[0].name === "b" && result[1].name === "c") || (result[0].name === "c" && result[1].name === "b")));

    

    elements = [{
        name : "a",
        dependencies : ["b"],
    }, {
        name : "b",
        dependencies : ["a"],
    }];
    Console.take();
    Console.muted = true;
    result = Dependencies.getAll(elements[0], elements);
    Console.free();
    assert("direct circular dependencies test", (Console.store.warn[0].includes("circular")));
    Console.clear();

    elements = [{
        name : "a",
        dependencies : ["b"],
    }, {
        name : "b",
        dependencies : ["c"],
    }, {
        name : "c",
        dependencies : ["a"],
    }];
    Console.take();
    Console.muted = true;
    result = Dependencies.getAll(elements[0], elements);
    Console.free();
    assert("indirect circular dependencies test", Console.store.warn[0].includes("circular"));
    Console.clear();

    elements = [{
        name : "a",
        dependencies : "<b>",
    }, {
        name : "b",
        dependencies : ["c"],
    }, {
        name : "c",
    }];
    result = Dependencies.getAll(elements[0], elements);
    assert("reference syntax dependencies test", (result[0].name === "b" && result[1].name === "c") || (result[0].name === "c" && result[1].name === "b"));

    elements = [{
        name : "a",
        dependencies : "<b>",
    }];
    Console.take();
    Console.muted = true;
    result = Dependencies.getAll(elements[0], elements);
    Console.free();
    assert("referencing a missing element while getting dependencies test", Console.store.error[0].includes(`cannot resolve/find element: "b". Returning incomplete list of dependencies`));
    Console.clear();

    console.debug("dependencyHandlingTest Function: Finshed tests");
};