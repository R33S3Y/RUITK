import { Type } from "./tester.js";
import { Merge } from "./merger.js";

export class Tester {
    /**
     * Validates that all required keys in the template object exist in the actual object
     * and checks if the values in the actual object match the specified types in the template.
     * 
     * @param {dict | Array} template The template object with required keys and their expected types.
     * @param {dict | Array} actual The actual object to test against the template.
     * @param {string} prefix message prefix
     * @param {string} suffix message suffix
     * @returns {Array} An object containing missing or type-mismatched keys (if any), or null if valid.
     */
    static test (template, actual, prefix = "", suffix = "",) {
        function resolveKey (template, actual) {

            let issues = [];

            if (Type.isType(template, "string")) {
                template = { type : template };
            }
            if (!Type.isType(template, "dict")) {
                issues.push("Tester.test Function: template is not string or dict");
                console.error(issues[-1]);
                return issues;
            }
            if (Type.isType(template.type, "string")) {
                template.type = [ template.type ];
            }
            if (Type.isType(template.nestedType, "string")) {
                template.type = [ template.nestedType ];
            }

            let template = Merge.dicts({
                type : [],
                full : undefined,
                empty : undefined,
                template : undefined,
                nestedType : undefined,
            }, template, []);

            
            let squashedActual = Type.squashType(actual);
            let type = Type.getType(actual);

            if(!template.type.includes(type)) {
                issues.push(`Value '${squashedActual}' is expected to be of type/s (${template.type}), but got '${type}' instead`);
            }

            if (type.includes("string")) {
                if (template.empty === false && !squashedActual) {
                    issues.push(`Value '${value}' cannot be empty`);
                } else if (template.empty === true && squashedActual) {
                    issues.push(`Value '${value}' must be empty`);
                }
                if (template.full === false && squashedActual) {
                    issues.push(`Value '${value}' must not be full`);
                } else if (template.full === true && !squashedActual) {
                    issues.push(`Value '${value}' must be full`);
                }
            }
            if (type.includes("array")) {
                if (template.empty === false && squashedActual.length === 0) {
                    issues.push(`Value '${value}' cannot be empty`);
                } else if (template.empty === true && squashedActual.length > 0) {
                    issues.push(`Value '${value}' must be empty`);
                }
                if (template.full === false && squashedActual.length > 0) {
                    issues.push(`Value '${value}' must not be full`);
                } else if (template.full === true && squashedActual.length === 0) {
                    issues.push(`Value '${value}' must be full`);
                }
            }
            if (type.includes("dict")) {
                if (template.empty === false && Object.keys(squashedActual).length === 0) {
                    issues.push(`Value '${value}' cannot be empty`);
                } else if (template.empty === true && Object.keys(squashedActual).length > 0) {
                    issues.push(`Value '${value}' must be empty`);
                }
                if (template.full === false && Object.keys(squashedActual).length > 0) {
                    issues.push(`Value '${value}' must not be full`);
                } else if (template.full === true && Object.keys(squashedActual).length === 0) {
                    issues.push(`Value '${value}' must be full`);
                }
            }


            if (type.includes("array") || type.includes("dict")) {
                if (Type.isType(template.nestedType, "array")) {
                    for (let key in actual) {
                        if (!type.isTypes(actual[key], template.nestedType)) {
                            issues.push(`Value '${squashedActual}' is expected to contain the following type/s (${template.nestedType}) nested types, but got '${Type.getType(actual[key])}' instead`);
                        }
                    }
                }
                
                if (Tester.isTypes(template.template, ["array", "dict"])) {
                    issues.concat(resolveAll(template.template, actual));
                }
            }

            return issues;

        }
        function resolveAll (template, actual){
            let issues = [];

            if (!Type.isTypes(actual, [ "array", "dict"])) {
                issues.push("Tester.test Function: actual is not an array or dict");
                console.error(issues[-1]);
                return issues;
            }

            if (Type.getType(Type.squashType(template)) !== Type.getType(Type.squashType(template))) {
                issues.push("Tester.test Function: The templates and actual type does not match");
                console.error(issues[-1]);
                return issues;
            }
            
            for (let key in template) {
                /** 
                 * At this point is there is no guarantee that the key will exist in actual.
                 * However we can guarantee that it is a dict or array so if it doesnt exist it will return undefined
                 */
                issues.concat(resolveKey(template[key], actual[key]));
            }

            return issues;
        }

        if (!Type.isType(prefix, "string")) {
            issues.push("Tester.test Function: prefix is not String");
            console.error(issues[-1]);
            return issues;
        }
        if (!Type.isType(suffix, "string")) {
            issues.push("Tester.test Function: suffix is not string");
            console.error(issues[-1]);
            return issues;
        }

        let issues = resolveAll(template, actual);

        for (let i in issues) {
            if(issues[i].includes("Tester.test Function:")) {
                continue;
            }
            issues[i] = `${prefix}${issues[i]}${suffix}`;
            console.warn(issues[i]);
        }
        if (Object.keys(issues).length !== 0) {
            console.debug(actual);
        }

        return issues;
    }
    /**
     * Validates that all required keys in the template object exist in the actual object
     * and checks if the values in the actual object match the specified types in the template.
     * 
     * @param {dict} template The template object with required keys and their expected types.
     * @param {dict} actual The actual object to test against the template.
     * @param {string} prefix message prefix
     * @param {string} suffix message suffix
     * @returns {dict} An object containing missing or type-mismatched keys (if any), or null if valid.
     */
    static dicts(template, actual, prefix = "", suffix = "") {

        let issues = {};

        for (let key in template) {
            if (!(key in actual)) {
                issues[key] = `Key '${key}' is missing`;
                continue;
            }

            let expected = template[key];
            
            if (typeof expected === "string" || Array.isArray(expected) === true) {
                expected = {type : expected};
            }

            let { type, empty, full } = expected;
            if(Array.isArray(type) === false) {
                type = [type];
            }
            if (!isTypes(actual[key], type)) {
                issues[key] = `Key '${key}' is expected to be of type/s (${JSON.stringify(type).slice(1, -1)}), but got '${getType(actual[key])}'`;
            } else {
                if (isType(actual[key], "string")) {
                    if (empty === false && !actual[key]) {
                        issues[key] = `Key '${key}' cannot be empty`;
                    } else if (empty === true && actual[key]) {
                        issues[key] = `Key '${key}' must be empty`;
                    }
                    if (full === false && actual[key]) {
                        issues[key] = `Key '${key}' must not be full`;
                    } else if (full === true && !actual[key]) {
                        issues[key] = `Key '${key}' must be full`;
                    }
                }
            }
        }

        for (let key in issues) {
            issues[key] = `${prefix}${issues[key]}${suffix}`;
            console.error(issues[key]);
        }
        if (Object.keys(issues).length !== 0) {
            console.debug(actual);
        }

        return Object.keys(issues).length === 0 ? null : issues;
    }
}

/**
 * Checks if a value matches any type
 * @param {any} value - The value to check
 * @param {Array} types - Array if strings type.
 * @returns {boolean} - True if matchs any type
 */
function isTypes (value, types) {
    for (let type of types) {
        if (isType(value, type) === true) return true;
    }
    return false;
}

/**
* Checks if a value matches a specified type.
* @param {any} value - The value to check.
* @param {string} type - The expected type (e.g., "string", "number", "array", "map", "set", "HTMLElement").
* @returns {boolean} - True if the value matches the type, false otherwise.
*/
function isType(value, type) {
    if (type === "array") return Array.isArray(value);
    if (type === "null") return value === null;
    if (type === "map") return value instanceof Map;
    if (type === "set") return value instanceof Set;
    if (type === "HTMLElement") return value instanceof HTMLElement;
    if (type === "function") return value instanceof Function;
    if (type === "dict") return typeof value === "object" && !Array.isArray(value) && !(value instanceof Map) && !(value instanceof Set) && !(value instanceof HTMLElement) && !(value instanceof Function) && value !== null;
    return typeof value === type && !Array.isArray(value) && !(value instanceof Map) && !(value instanceof Set) && !(value instanceof HTMLElement) && !(value instanceof Function) && value !== null;
}

/**
* Determines the type of a value.
* @param {any} value - The value to analyze.
* @returns {string} - The type of the value.
*/
function getType(value) {
    if (Array.isArray(value)) return "array";
    if (value === null) return "null";
    if (value instanceof Map) return "map";
    if (value instanceof Set) return "set";
    if (value instanceof HTMLElement) return "HTMLElement";
    if (value instanceof Function) return "function";
    if (typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof Map) && !(value instanceof Set) && !(value instanceof HTMLElement)) return "dict";
    return typeof value;
}