import { Merge } from "../../support/merger.js";
import { Style } from "../../support/style.js";


let elements = [
    {   // textbox
        name : "textbox",
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
    }, { // radio
        name : "radio",
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
        name : "checkbox",
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
    }, { // dropdown
        name : "dropdown",
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
    }, { // combo Box
        name : "combo",
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
    }, { // button
        name : "button",
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
    }, { // submit
        name : "submit",
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