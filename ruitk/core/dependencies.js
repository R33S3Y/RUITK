import { Tester } from "../support/tester.js";

export class Dependencies {
    /**
     * Resolves all of the [Referencing syntax](tileWin/doc/Making%20Elements.md#Other) for a element
     * @param {dict} element The element that you want to resolve
     * @param {Array} elements The list of the elements that we resolve the element aganist
     * @returns {dict} the resolved element.
     */
    static resolveAll(element, elements) {
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
                    console.error(`Dependency Error: key: "${key}" is undefined in Element: "${element.name}". \n Key is used as a depenancy for Element: "${element.name}"`);
                }
                element[key] = searchElement[key];
                break;
            }
        }
        if (foundElement === false) {
            console.error(`Dependency Error: Failed to find Element: "${elementName}" which is needed as a dependancy for Element: "${element.name}"`);
            element[key] = undefined;
        }

        return element;
    }
    
    static getAll(element, elements) {
        
    }
    static get(element, elements) {

    }
}