import { Merge } from "../../support/merger.js";
import { Style } from "../../support/style.js";


let elements = [
    {   // text box
        name : "",
        function : (info, element) => {
            info = Merge.dicts({
                
            }, info);

            let e = element.generate(info, element);
            
            return e;
        },
        generate : "<base>",
        style : {
            
        },
        element : "input"
    }, { // radio box
        name : "",
        function : (info, element) => {
            info = Merge.dicts({
                
            }, info);

            let e = element.generate(info, element);
            
            return e;
        },
        generate : "<base>",
        style : {
            
        },
        element : "input"
    }, { // checkbox
        name : "",
        function : (info, element) => {
            info = Merge.dicts({
                
            }, info);

            let e = element.generate(info, element);
            
            return e;
        },
        generate : "<base>",
        style : {
            
        },
        element : "input"
    }, { // Dropdown
        name : "",
        function : (info, element) => {
            info = Merge.dicts({
                
            }, info);

            let e = element.generate(info, element);
            
            return e;
        },
        generate : "<base>",
        style : {
            
        },
        element : "input"
    }, { // Combo Box
        name : "",
        function : (info, element) => {
            info = Merge.dicts({
                
            }, info);

            let e = element.generate(info, element);
            
            return e;
        },
        generate : "<base>",
        style : {
            
        },
        element : "input"
    }, { // Button
        name : "",
        function : (info, element) => {
            info = Merge.dicts({
                
            }, info);

            let e = element.generate(info, element);
            
            return e;
        },
        generate : "<base>",
        style : {
            
        },
        element : "input"
    }, { // Submit form
        name : "",
        function : (info, element) => {
            info = Merge.dicts({
                
            }, info);

            let e = element.generate(info, element);
            
            return e;
        },
        generate : "<base>",
        style : {
            
        },
        element : "input"
    }
];

export class FallenInput {
    static getElements() {
        return elements;
    }
}