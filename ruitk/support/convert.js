export class Convert {
    /**
     * needs to support:
     * 1 : normal words
     * 2 : dashed-case
     * 3 : snake_case
     * 4 : camelCase
     * 5 : single
     */
    
    static convert(str, type) {
        const oldType = detect(str);
        const wordsArray = toArray(str, oldType); // Convert input string to an array of words
        // Convert the array to the intended type using appropriate conversion function
        switch (type) {
            case 1:
            case "normal words":
            case "normalWords":
                return toNormalWords(wordsArray);
            case 2:
            case "dashed-case":
            case "dashedCase":
                return toDashedCase(wordsArray);
            case 3:
            case "snake_case":
            case "snakeCase":
                return toSnakeCase(wordsArray);
            case 4:
            case "camelCase":
                return toCamelCase(wordsArray);
            default:
                console.error("Invalid conversion type");
                console.debug(type);
                return str;
        }
    }
}

// Helper functions
function toArray(str, type) {
    switch (type) {
        case 1:
            return str.split(" "); // Normal words split by space
        case 2:
            return str.split("-"); // Dashed-case split by hyphen
        case 3:
            return str.split("_"); // Snake_case split by underscore
        case 4: // CamelCase split using regex
            return str.split(/(?=[A-Z])/).map(word => word.toLowerCase());
        case 5:
            return [str]; // Single word as single element array
        default:
            throw new Error("Invalid type detected");
    }
}

function detect(str) {
    if (str.includes(" ")) {
        return 1; // Normal words
    } 
    if (str.includes("-")) {
        return 2; // Dashed-case
    } 
    if (str.includes("_")) {
        return 3; // Snake_case
    } 
    if (str !== str.toLowerCase() && str !== str.toUpperCase() && /^[a-z][A-Za-z]*$/.test(str)) {
        return 4; // CamelCase
    }
    return 5; // Single word
}

function toNormalWords(array) {
    let str = "";
    for (let subStr of array) {
        str += `${subStr.toLowerCase()} `
    }
    return str.slice(0, -1);
}
function toDashedCase(array) {
    let str = "";
    for (let subStr of array) {
        str += `${subStr.toLowerCase()}-`
    }
    return str.slice(0, -1);
}
function toSnakeCase(array) {
    let str = "";
    for (let subStr of array) {
        str += `${subStr.toLowerCase()}_`
    }
    return str.slice(0, -1);
}
function toCamelCase(array) {
    let str = "";
    for (let subStr of array) {
        str += (str.charAt(0).toUpperCase() + str.slice(1));
    }
    return str.slice(0, -1);
}