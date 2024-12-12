import { Merge } from "../../support/merger.js";
import { Style } from "../../support/style.js";

let elements = [
    {   // textbox
        name : "textbox",
        function : (info, element) => {
            info = Merge.dicts({
                placeholder : "Enter text",
                content : "",
            }, info);

            let e = element.generate(info, element);
            e.type = "text";
            e.placeholder = info.placeholder;
            if(info.content) {
                e.value = info.content;
            }

            return e;
        },
        generate : "<base>",
        style : {
            width : "100%",
            color : "var(--accent3)",
            backgroundColor : "var(--background2)",
        },
        style_standard : "<base>",
        style_border : "<base>",
        style_paddingMedium : "<base>",
        element : "input"
    },
    {   // radio
        name : "radio",
        function : (info, element) => {
            info = Merge.dicts({
                question : "",
                options : [],
            }, info);

            let e = [];

            // question handling
            if (typeof info.question === "string") {
                info.question = element.makeElements(`<h3>{ content : "${info.question}" }`)
            }
            if (Array.isArray(info.question) === false) {
                info.question = [info.question];
            }
            for (let item of info.question) {
                e.push(item);
            }
            
            // form
            let form = element.generate(Merge.dicts(info, {element : "form"}, []), element);

            let i = 0;
            for (let option of info.options) {
                let fakeInfo = {};

                fakeInfo.id = `box-${element.elementCount}-${i}`;
                i ++;
                fakeInfo.content = option;

                let box = element.makeOneBox(fakeInfo, element);

                if (Array.isArray(box) === false) {
                    box = [box];
                }
                for (let item of box) {
                    if (typeof item === "string") {
                        form.innerHTML += item; 
                    } else if (item instanceof HTMLElement) {
                        form.appendChild(item); 
                    }
                }
            }
            e.push(form);

            return e;
            
        },
        generate : "<base>",
        makeOneBox : (info, element) => {

            let checkbox = document.createElement("input");
            checkbox.type = element.name; // yes I know this is a cheeky work around but this function is only going to be used for radio and checkbox
            
            checkbox = Style.style(checkbox, [element.style.box, element.style_standard, element.style_paddingMedium, element.style_border]);

            if (info.content) {
                if (typeof info.content === "string") {
                    info.content = element.makeElements(`<p1>{ content : "${info.content}" }`)
                }
                if (Array.isArray(info.content) === false) {
                    info.content = [info.content];
                } // no need for content handling other than orgnization as is handle in the generate function
            } else {
                info.content = [];
            }
            info.content.unshift(checkbox);

            
            let e = element.generate(info, element);
            e = Style.style(e, element.style.label);

            return e;
        },
        style : {
            box : {
                appearance: "none",

                cursor : "pointer",

                background : "var(--background2)",
                hover_background : "var(--background3)",
                
                checked_background : "var(--accent1)",
                checked_hover_background : "var(--accent2)",
            },
            label : {
                display : "inline-flex",
                alignItems : "center",
            },
        },

        style_standard : "<base>",
        style_paddingMedium : "<base>",
        style_border : "<base>",
        element : "label",
        handleStyle : true,
    },
    {   // checkbox
        name : "checkbox",
        function : (info, element) => {
            info = Merge.dicts({
                name : "",
                checked : false,
            }, info);

            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = info.checked;
            
            checkbox = Style.style(checkbox, [element.style.box, element.style_standard, element.style_paddingMedium, element.style_border]);
            

            if (info.content) {
                if (typeof info.content === "string") {
                    info.content = element.makeElements(`<p1>{ content : "${info.content}" }`)
                }
                if (Array.isArray(info.content) === false) {
                    info.content = [info.content];
                }
            } else {
                info.content = [];
            }
            info.content.unshift(checkbox);

            let e = element.generate(info, element);
            e = Style.style(e, element.style.label);
            return e;
        },
        generate : "<base>",
        style : {
            box : {
                appearance: "none",

                cursor : "pointer",
                borderRadius : "0",

                background : "var(--background2)",
                hover_background : "var(--background3)",
                
                checked_background : "var(--accent1)",
                checked_hover_background : "var(--accent2)",
            },
            label : {
                display : "inline-flex",
                alignItems : "center",
            },
        },
        style_standard : "<base>",
        style_paddingMedium : "<base>",
        style_border : "<base>",
        element : "label",
        handleStyle : true,
    },
    {   // dropdown
        name : "dropdown",
        function : (info, element) => {
            info = Merge.dicts({
                options : []
            }, info);

            let e = document.createElement("select");
            e.id = `${element.name}-${element.elementCount}`;

            let selectStyles = Merge.dicts(element.style, element.style_standard);
            selectStyles = Merge.dicts(selectStyles, element.style_border);
            selectStyles = Merge.dicts(selectStyles, element.style_paddingMedium);

            e = Style.style(e, selectStyles);

            let optionStyles = Merge.dicts(element.style_option, element.style_standard);
            for (let option of info.options) {
                let optionElement = document.createElement("option");
                optionElement.value = option.value || option;
                optionElement.textContent = option.label || option;
                optionElement = Style.style(optionElement, optionStyles);
                e.appendChild(optionElement);
            }

            return e;
        },
        generate : "<base>",
        style : "<combo>",
        style_option : "<combo>",
        style_standard : "<base>",
        style_border : "<base>",
        style_paddingMedium : "<base>",
        element : "select",
        handleStyle : true,
    },
    {   // combo box
        name : "combo",
        function : (info, element) => {
            info = Merge.dicts({
                list : `${element.name}${element.elementCount}`,
                options : []
            }, info);

            let e = element.generate(info, element);
            e.type = "text";
            e.setAttribute("list", info.list);

            let dataList = document.createElement("datalist");
            dataList.id = info.list;
            for (let option of info.options || []) {
                let optionElement = document.createElement("option");
                optionElement.value = option;
                dataList.appendChild(optionElement);
            }

            e.appendChild(dataList);
            return e;
        },
        generate : "<base>",
        style : {
            color : "var(--accent3)",
            backgroundColor : "var(--background2)",
        },
        style_option : {
            color : "var(--accent3)",
            backgroundColor : "var(--background2)",
        },
        style_standard : "<base>",
        style_border : "<base>",
        style_paddingMedium : "<base>",
        element : "input"
    },
    {   // button
        name : "button",
        function : (info, element) => {
            info = Merge.dicts({
                text : "Click me"
            }, info);

            let e = element.generate(info, element);
            e.type = "button";
            e.value = info.text;

            return e;
        },
        generate : "<base>",
        style : "<submit>",
        style_standard : "<base>",
        style_border : "<base>",
        style_paddingMedium : "<base>",
        element : "input"
    },
    {   // submit
        name : "submit",
        function : (info, element) => {
            info = Merge.dicts({
                content : "Submit",
            }, info);

            let e = element.generate(info, element);
            e.type = "submit";
            e.value = info.content;

            return e;
        },
        generate : "<base>",
        style : {
            color : "var(--standout4)",
            cursor : "pointer",

            backgroundColor : "var(--accent1)",
            hover_backgroundColor : "var(--accent2)",
        },
        style_standard : "<base>",
        style_border : "<base>",
        style_paddingMedium : "<base>",
        element : "input"
    }
];

export class FallenStaging {
    static getElements() {
        return elements;
    }
}
