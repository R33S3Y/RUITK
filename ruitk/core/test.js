import { Konsole } from "../support/konsole.js";
import { FallenBase } from "../themes/fallen/base.js";
import { Ruitk } from "./ruitk.js";
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
        Konsole.dump();
        console.error(`dependencyHandlingTest Function: ${testName} failed.`);
      }
    } catch {
      Konsole.dump();
      console.error(`dependencyHandlingTest Function: ${testName} failed.`);
    }
  }

  console.debug("dependencyHandlingTest Function: Starting tests...");

  let result = {};
  let elements = [];

  elements = [{
    name: "a",
    thing1: "thing1",
  }, {
    name: "b",
    thing1: "<a>",
  }];
  result = Dependencies.resolve(elements[1], "thing1", elements);
  assert("resolve test", (result.thing1 === "thing1"));

  elements = [{
    name: "a",
    thing1: "thing1",
    thing2: "thing2",
  }, {
    name: "b",
    thing1: "<a>",
    thing2: "<a>",
  }];
  result = Dependencies.resolveAll(elements[1], elements);
  assert("resolveAll test", (result.thing1 === "thing1" && result.thing2 === "thing2"));



  elements = [{
    name: "a",
    thing1: "<b>",
  }];
  Konsole.take();
  Konsole.muted = true;
  result = Dependencies.resolve(elements[0], "thing1", elements);
  Konsole.free();
  assert("resolve to missing element test", (Konsole.store.error[0].includes(`Failed to find Element: "b"`)));
  Konsole.clear();

  elements = [{
    name: "a",
    thing1: "<b>",
  }, {
    name: "b",
  }];
  Konsole.take();
  Konsole.muted = true;
  result = Dependencies.resolve(elements[0], "thing1", elements);
  Konsole.free();
  assert("resolve to undefined key test", (Konsole.store.error[0].includes(`key: "thing1" is undefined in Element: "a".`)));
  Konsole.clear();






  elements = [{
    name: "a",
    thing1: "<b>",
  }, {
    name: "b",
    thing1: "thing1",
  }];
  result = Dependencies.get(elements[0], elements);
  assert("referencing syntax get test", (result[0].name === "b"));

  elements = [{
    name: "a",
    thing1: "<b>",
  }, {
    name: "b",
    thing1: "<c>",
  }, {
    name: "c",
    thing1: "thing1",
  }];
  result = Dependencies.getAll(elements[0], elements);
  assert("referencing syntax getAll test", ((result[0].name === "b" && result[1].name === "c") || (result[0].name === "c" && result[1].name === "b")));



  elements = [{
    name: "a",
    dependencies: ["b"],
  }, {
    name: "b",
  }];
  result = Dependencies.get(elements[0], elements);
  assert("dependencies array syntax get test", (result[0].name === "b"));

  elements = [{
    name: "a",
    dependencies: "b",
  }, {
    name: "b",
  }];
  result = Dependencies.get(elements[0], elements);
  assert("dependencies string syntax get test", (result[0].name === "b"));

  elements = [{
    name: "a",
    dependencies: ["b"],
  }, {
    name: "b",
    dependencies: "c",
  }, {
    name: "c",
  }];
  result = Dependencies.getAll(elements[0], elements);
  assert("dependencies syntax getAll test", ((result[0].name === "b" && result[1].name === "c") || (result[0].name === "c" && result[1].name === "b")));



  elements = [{
    name: "a",
    dependencies: ["b"],
  }, {
    name: "b",
    dependencies: ["a"],
  }];
  Konsole.take();
  Konsole.muted = true;
  result = Dependencies.getAll(elements[0], elements);
  Konsole.free();
  assert("direct circular dependencies test", (Konsole.store.warn[0].includes("circular")));
  Konsole.clear();

  elements = [{
    name: "a",
    dependencies: ["b"],
  }, {
    name: "b",
    dependencies: ["c"],
  }, {
    name: "c",
    dependencies: ["a"],
  }];
  Konsole.take();
  Konsole.muted = true;
  result = Dependencies.getAll(elements[0], elements);
  Konsole.free();
  assert("indirect circular dependencies test", Konsole.store.warn[0].includes("circular"));
  Konsole.clear();

  elements = [{
    name: "a",
    dependencies: "<b>",
  }, {
    name: "b",
    dependencies: ["c"],
  }, {
    name: "c",
  }];
  result = Dependencies.getAll(elements[0], elements);
  assert("reference syntax dependencies test", (result[0].name === "b" && result[1].name === "c") || (result[0].name === "c" && result[1].name === "b"));

  elements = [{
    name: "a",
    dependencies: "<b>",
  }];
  Konsole.take();
  Konsole.muted = true;
  result = Dependencies.getAll(elements[0], elements);
  Konsole.free();
  assert("referencing a missing element while getting dependencies test", Konsole.store.error[0].includes(`cannot resolve/find element: "b". Returning incomplete list of dependencies`));
  Konsole.clear();

  console.debug("dependencyHandlingTest Function: Finshed tests");
};

Ruitk.prototype.xssTest = function () {
  console.debug("xssTest Function: Starting tests...");

  Konsole.take();
  Konsole.muted = true;

  let ruitk = new Ruitk;
  ruitk.addElements(FallenBase.getElements());

  Konsole.clear();
  Konsole.free();

  let injections = [
    `<img src=x onerror=console.error('xssTest_Function:_XSS_attack_1_succeeded') ><img src=x onerror=alert('xssTest_Function:_XSS_attack_1_succeeded') >`,
    `Hi :3", onAny : () => { console.error("xssTest Function: XSS attack 2 succeeded"); alert("xssTest Function: XSS attack 2 succeeded"); }, blank : "`,
  ];
  for (let i = 0; i < injections.length; i++) {
    let injection = injections[i];
    Konsole.take();
    Konsole.muted = true;
    let error = false;

    try {
      ruitk.append("body", ruitk.makeElements(`
                <p1>{content : "${injection}"}
            `));
    } catch {
      Konsole.dump();
      console.error(`xssTest Function: Injection: ${i + 1} of ${injections.length} "${injection}" Ruitk has errored out. Test failed`);
      error = true;
    }
    for (let error of Konsole.store.error) {
      if (error.includes("XSS")) {
        error = true;
        console.error(`xssTest Function: Injection: ${i + 1} of ${injections.length} "${injection}" XSS injection has succeed. Test failed`);
      }
    }
    Konsole.free();
    Konsole.clear();
    if (error === false) {
      console.debug(`xssTest Function: Injection: ${i + 1} of ${injections.length} "${injection}" XSS injection code has not run yet. Test Passed`);
    }
  }
  console.debug("xssTest Function: Finshed tests");
}
