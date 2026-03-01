import { Tester } from "../support/tester.js";

export class Dependencies {
    /**
     * Resolves all of the [Referencing syntax](tileWin/doc/Making%20Elements.md#Other) for a element
     * @param {dict} element The element that you want to resolve
     * @param {Array} elements The list of the elements that we resolve the element aganist
     * @returns {dict} the resolved element.
     */
    static resolveAll(element, elements) {
        Tester.dicts({ 
            element : "dict",
            elements : "array" }, 
            { element, elements }, 
            "Dependencies.resolveAll function: "
        );
        let keys = Object.keys(element);
        for (let key of keys) {
            element = Dependencies.resolve(element, key, elements);    
        }
        return element;
    }
    /**
     * Resolves [Referencing syntax](tileWin/doc/Making%20Elements.md#Other) for a key in the element
     * @param {dict} element The element that you want to resolve
     * @param {string} key The key to resolve
     * @param {Array} elements The list of the elements that we resolve the element aganist
     * @returns {dict} the resolved element.
     */
    static resolve(element, key, elements) {
        element = {... element}; // makes sure we dont modify the input
        Tester.dicts({ 
            element : "dict",
            key : "string",
            elements : "array" }, 
            { element, key, elements }, 
            "Dependencies.resolve function: "
        );

        let regex = /^<[\w\d]+>$/;
        if (typeof element[key] !== "string" ) {
            return element;
        }
        if (regex.test(element[key]) === false) {
            return element;
        }

        let elementName = element[key];

        elementName = elementName.replace("<", "");
        elementName = elementName.replace(">", "");
        
        let foundElement = false;
        for(let searchElement of elements) {
            if (searchElement.name === elementName) {
                foundElement = true;
                if (searchElement[key] === undefined) {
                    console.error(`Dependencies.resolve function: key: "${key}" is undefined in Element: "${element.name}". It is used as a depenancy for Element: "${element.name}"`);
                }
                element[key] = searchElement[key];
                break;
            }
        }
        if (foundElement === false) {
            console.error(`Dependencies.resolve function: Failed to find Element: "${elementName}" which is needed as a dependancy for Element: "${element.name}"`);
            element[key] = undefined;
        }

        return element;
    }
    /**
     * Gets all dependencies of a element
     * @param {dict} element the element you want to find all dependencys for
     * @param {Array} elements all elements to search
     * @returns {Array} array of all dependacys
     */
    static getAll(element, elements) {
        Tester.dicts({ 
            element : "dict",
            elements : "array" }, 
            { element, elements }, 
            "Dependencies.getAll function: "
        );
        let dependencies = Dependencies.get(element, elements);

        let allDependencies = [];
        for (let depenancy of dependencies) {
            allDependencies = allDependencies.concat(getAllDependencys([element], depenancy, elements));
        }
        return Array.from( new Map(allDependencies.map(dict => [dict.name, dict])).values());
        /**
         * get all dependacys that a element depends on
         * @param {Array} higherDependecies all elements dependnt on element in order
         * @param {dict} element the element to resolve below
         * @param {Array} elements all elements availabe to search
         * @returns {Array} all elements that element depends on inculding itself
         */
        function getAllDependencys (higherDependencies, element, elements) { 
            Tester.dicts({ 
                higherDependencies : "array",
                element : "dict",
                elements : "array" }, 
                { higherDependencies, element, elements }, 
                "Dependencies.getAll function: "
            );

            let lowerDepenancies = Dependencies.get(element, elements);

            let allDependencies = [element];

            for (let depenancy of lowerDepenancies) {

                //circular dependencies check
                if (getElementByName(depenancy.name, higherDependencies) !== null) {
                    console.warn(`Dependencies.getAll function: circular dependancy chain detected...`);
                    console.warn(`    element: "${element.name}" depends on "${depenancy.name}" ...`);

                    let loopStart = 0;
                    for (let i = 0; i < higherDependencies.length; i++) {
                        if (higherDependencies[i].name === depenancy.name) {
                            loopStart = i+1;
                            break;
                        }
                    }
                    for (let i = loopStart; i < higherDependencies.length; i++) {
                        console.warn(`    ... which depends on "${higherDependencies[i].name}" ...`);
                    }
                    console.warn(`    ... which depends on element: "${element.name}".`);

                    console.warn(`    Please note that dependant on what part/key of each of element the others depends on this might still all resolve but you should still fix it`);
                    continue;
                }

                allDependencies = allDependencies.concat(getAllDependencys([ ... higherDependencies, element], depenancy, elements));
            }

            return allDependencies;
        }
    }
    /**
     * Gets the direct dependencies of a element
     * @param {dict} element the element you wnat the depnenanys of
     * @param {Array} elements the elements the search against
     * @returns {Array} arroy of dependencies that we found (will be empty if none were found)
     */
    static get(element, elements) {
        Tester.dicts({ 
            element : "dict",
            elements : "array" }, 
            { element, elements }, 
            "Dependencies.get function: "
        );
        let dependencyNames = [];

        for (let key in element) {
            let regex = /^<[\w\d]+>$/;
            if (typeof element[key] !== "string" ) {
                continue;
            }
            if (regex.test(element[key]) === false) {
                continue;
            }

            let elementName = element[key];

            elementName = elementName.replace("<", "");
            elementName = elementName.replace(">", "");

            dependencyNames.push(elementName);
        }

        if (Array.isArray(element.dependencies)) {
            dependencyNames = dependencyNames.concat(element.dependencies);
        }

        let regex = /^<[\w\d]+>$/;
        if (typeof element.dependencies !== "string" ) {
            return getElementByNames(dependencyNames, elements);
        }
        if (regex.test(element.dependencies) === false) {
            dependencyNames.push(element.dependencies);
            return getElementByNames(dependencyNames, elements);
        }

        let elementName = element.dependencies;

        elementName = elementName.replace("<", "");
        elementName = elementName.replace(">", "");

        let dependencyRef = getElementByName(elementName, elements);

        if (dependencyRef === null) { 
            return getElementByNames(dependencyNames, elements); // Logging will happen in this function
        }
        dependencyNames = dependencyNames.concat(dependencyRef.dependencies);

        return getElementByNames(dependencyNames, elements);
    }
}

/**
 * Gets the element by a name.
 * @param {string} name Name of element
 * @param {Array} elements Array of elements
 * @returns {Array} arroy of Elements matching names or empty array if none were found
 */
function getElementByName(name, elements) {
    Tester.dicts({ 
        name : "string",
        elements : "array" }, 
        { name, elements }, 
        "getElementByName function: "
    );
    for (let element of elements) {
        if (element.name === name) return element;
    }
    return null;
}

/**
 * Gets a list of elements by a name.
 * @param {Array} names Names of elements to searchs
 * @param {Array} elements Array of elements
 * @returns {dict} Element or null if no element was found
 */
function getElementByNames(names, elements) {
    Tester.dicts({ 
        names : "array",
        elements : "array" }, 
        { names, elements }, 
        "Dependencies.get function: "
    );
    names = [...new Set(names)];
    let dependencies = [];

    for(let searchDependency of names) {
        let depenancy = getElementByName(searchDependency, elements);

        if (depenancy === null) {
            console.error(`Dependencies.get function: cannot resolve/find element: "${searchDependency}". Returning incomplete list of dependencies`);
            continue;
        }

        dependencies.push(depenancy);
    }
    return dependencies;
}