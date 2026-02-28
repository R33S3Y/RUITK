import { Ruitk } from "./core.js";
import { Internal } from "./internal.js";

import { Merge } from "../support/merger.js";
import { Dependencies } from "./dependencies.js";

/**
 * Imports elements into RUITK
 * @param {Array | dicts} elements elements or array of elements
 * @returns {void} Nothing 
 */
Ruitk.prototype.addElements = function ( elements = [] ) {
    /**
     * Element example
     * {
     * name : "button1",
     * function : (inputDict, element) => {
     *      return document.createElement("button");
     * },
     * style : {
     *  transition: "all 0.2s ease-in-out",
     *  position : "absolute",
     *  overflow : "hidden",
     *  // background
     *  backgroundColor : colors.inactiveB1,
     *  backdropFilter: "blur(4px)",
     *  hover_backgroundColor : colors.activeB1,
     *  
     *  // border
     *  borderStyle : "solid",
     *  borderWidth : "3px",
     *  borderRadius : "15px",
     *  borderColor : colors.inactiveH2,
     *  boxShadow: "0 0 4px rgba(0, 0, 0, 1)",
     *  hover_boxShadow: "0 0 5px 2px rgba(0, 0, 0, 1)",
     *  hover_borderColor : colors.activeH2,
     *  }
     * }
     */
    if (Array.isArray(elements) === false) {
        elements = [elements];
    }
    let failCount = 0;
    for (let element of elements) {
        for (let currentElement of this.elements) {
            if (currentElement.name === element.name) {
                console.warn(`addElements Function: The name "${element.name}" is already in use. Due to this the new one has been regected`);
                failCount ++;
                break;
            }
        }
        element = Merge.dicts({
            name : "",
            function : (info, element) => {
                console.warn(`addElements Function: The element named: "${element.name}" is missing a function. This is the default function.`);
                return document.createElement("div");
            },
            style : {},
            handleStyle : false,
            parseLevel : 2,
            strictStyles : false,
            dependencies : [],
        }, element, []);
        this.elements.push(element);
    }
    console.debug(`addElements Function: Added ${elements.length - failCount} out of ${elements.length} new elements`);
    console.debug(`addElements Function: Starting dependency test`);

    /**
     * This func could be set up as a minor preformance inprovement.
     * 
     * In witch you resolve and save the element once, ahead of time, 
     * instead of resolving the element every time it is called at runtime.
     * It may also increase the size and memory reqiurements of this.elements. IDK just a thought.
     * 
     * 22/12/2025 - Reesey - The abuse function relies on this not being done for the Minimal dependency test.
     * It wouldn't cause any errors however it would make the Minimal dependency test substantily less Minimal
     */
    elements = JSON.parse(JSON.stringify(elements));
    for (let element of elements) {
        Dependencies.getAll(element, Array.from( new Map(this.elements.concat(elements).map(dict => [dict.name, dict])).values()));
    }

    console.debug(`addElements Function: Finished dependency test`);

    this.initFunctions();
    return;
};