import { Merge } from "../../support/merger.js";
import { Style } from "../../support/style.js";
import { Convert } from "../../support/convert.js";
import { Tester } from "../../support/tester.js";

let elements = [
    {   // textbox
        name : "textbox",
        function : (info, element) => {
            info = Merge.dicts({
                id : `"${element.name}-${element.elementCount}"`,
                idRoot : "",
                question : "",
                placeholder : "Enter text",
                form : "default",
                type : "text",
                spellcheck : false,
            }, info);

            info = Merge.dicts({
                name : Convert.convert(info.question, "camelCase"),
            }, info);

            Tester.dicts({
                id : { type: "string", full: true },
                idRoot : "string",
                form : { type: "string", full: true },
                placeholder : "string",
                type : "string",
                spellcheck : "boolean",
                question : "string",
                name :  { type: "string", full: true },
            }, info, `${element.name} Element: `);

            let form = element.makeGridandTitle(info, element);
            let e = element.generate(info, element);
            e.type = "text";
            e.placeholder = info.placeholder;
            e.name = info.name;
            e.type = info.type;
            e.spellcheck = `${info.spellcheck}`;
            e = Style.style(e, [element.style, element.style_standard, element.style_border, element.style_paddingMedium]);

            e.dataset.form = info.form;
            e.dataset.type = element.name;
            form.appendChild(e);
            return form;
        },
        makeGridandTitle : "<radio>",
        generate : "<base>",
        style : {
            color : "var(--accent3)",
            backgroundColor : "var(--background2)",
            fontSize : "var(--fontSizeP2)",
        },
        style_standard : "<base>",
        style_border : "<base>",
        style_paddingMedium : "<base>",
        element : "input",
        handleStyle : true,
    },
    {   // radio
        name : "radio",
        function : (info, element) => {
            // input testing
            info = element.inputTest(info, element);

            let form = element.makeGridandTitle(info, element);

            // form
            let i = 0;
            for (let option of info.options) {
                let fakeInfo = {};
                fakeInfo.id = `box-${element.elementCount}-${i}`;
                fakeInfo.content = option;
                fakeInfo.name = info.name;
                fakeInfo.value = info.values[i];
                i ++;

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
            form.dataset.form = info.form;
            form.dataset.type = element.name;
            return form;
        },
        makeOneBox : (info, element) => {
            info = Merge.dicts({
                name : "",
                value : "",
            }, info);

            let checkbox = document.createElement("input");
            checkbox.type = element.name; // yes I know this is a cheeky work around but this function is only going to be used for radio and checkbox
            checkbox.name = info.name;
            checkbox.value = info.value;
            
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
        inputTest : (info, element) => {
            // input testing
            info = Merge.dicts({
                id : `"${element.name}-${element.elementCount}"`,
                idRoot : "",
                question : "",
                form : '"default"',
                options : "[]",
            }, info);


            info.question = element.parse(info.question);
            info.form = element.parse(info.form);
            info.options = element.parse(info.options);
            if (info.name) {
                info.name = element.parse(info.name);
            }
            if (info.values) {
                info.values = element.parse(info.values);   
            }

            let values = [];
            for (let option of info.options) {
                values.push(Convert.convert(option, "camelCase"));
            }
            info = Merge.dicts({
                name : Convert.convert(info.question, "camelCase"),
                values : values,
            }, info, []);

            Tester.dicts({
                id : { type: "string", full: true },
                idRoot : "string",
                question : "string",
                options : { type: "array", full: true },
                name :  { type: "string", full: true },
                values : { type: "array", full: true },
                form : { type: "string", full: true },
            }, info, `${element.name} Element: `);

            return info;
        },
        makeGridandTitle : (info, element) => {
            let gridInfo = JSON.parse(JSON.stringify(info));
            delete gridInfo.question;
            delete gridInfo.options;
            delete gridInfo.name;
            delete gridInfo.values;
            delete gridInfo.list;
            delete gridInfo.form;
            delete gridInfo.placeholder;
            delete gridInfo.spellcheck;
            delete gridInfo.type;

            gridInfo.id = gridInfo.idRoot;
            
            let gridInfoStr = "";
            for (let key in gridInfo) {
                gridInfoStr += `${key} : ${gridInfo[key]}, `;
            }
            let form = element.makeElements(`<grid>{ ${gridInfoStr}}`);

            // question handling
            if (typeof info.question === "string") {
                info.question = element.makeElements(`<h3>{ content : "${info.question}" }`);
            }
            if (Array.isArray(info.question) === false) {
                info.question = [info.question];
            }
            for (let item of info.question) {
                if (typeof item === "string") {
                    form.innerHTML += item; 
                } else if (item instanceof HTMLElement) {
                    form.appendChild(item); 
                }
            }
            return form;
        },
        parseLevel : 1,

        generate : "<base>",
        element : "label",

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
        handleStyle : true,
        
    },
    {   // checkbox
        name : "checkbox",

        function : "<radio>",
        makeOneBox : "<radio>",
        inputTest : "<radio>",
        makeGridandTitle : "<radio>",
        parseLevel : 1,

        generate : "<base>",
        element : "label",
        
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
        handleStyle : true,
    },
    {   // dropdown
        name : "dropdown",
        inputTest : "<radio>",
        makeGridandTitle : "<radio>",
        function : (info, element) => {
            info = element.inputTest(info, element);

            let form = element.makeGridandTitle(info, element);

            let e = document.createElement("select");
            e.id = `${element.name}-${element.elementCount}`;
            e.name = info.name;
            e.dataset.form = info.form;
            e.dataset.type = element.name;

            e = Style.style(e, [element.style, element.style_standard, element.style_border, element.style_paddingMedium]);

            for (let i = 0; i < info.options.length; i++) {
                let option = info.options[i];
                let value = info.values[i];
                
                let optionElement = document.createElement("option");
                optionElement.value = value;
                optionElement.textContent = option;
                optionElement = Style.style(optionElement, [element.style_option, element.style_standard]);
                e.appendChild(optionElement);
            }
            
            form.appendChild(e);
            return form;
        },
        parseLevel : 1,

        generate : "<base>",
        element : "select",

        style : {
            color : "var(--accent3)",
            backgroundColor : "var(--background2)",
            fontSize : "var(--fontSizeP2)",
        },
        style_option : {
            color : "var(--accent3)",
            backgroundColor : "var(--background2)",
            fontSize : "var(--fontSizeP2)",
        },
        style_standard : "<base>",
        style_border : "<base>",
        style_paddingMedium : "<base>",
        handleStyle : true,
    },
    {   // combo box
        name : "combo",
        inputTest : "<radio>",
        makeGridandTitle : "<radio>",
        function : (info, element) => {
            info = element.inputTest(info, element);

            info = Merge.dicts({
                list : `"${element.name}-${element.elementCount}-datalist"`,
            }, info);
            info.list = element.parse(info.list);
            Tester.dicts({
                list : { type: "string", full: true },
            }, info, `${element.name} Element: `);

            let form = element.makeGridandTitle(info, element);

            let e = element.generate(info, element);
            e.name = info.name;
            e.dataset.form = info.form;
            e.dataset.type = element.name;
            e.type = "text";
            e.setAttribute("list", info.list);

            e = Style.style(e, [element.style, element.style_standard, element.style_border, element.style_paddingMedium]);

            let dataList = document.createElement("datalist");
            dataList.id = info.list;
            for (let i = 0; i < info.options.length; i++) {
                let option = info.options[i];
                let value = info.values[i];
                
                let optionElement = document.createElement("option");
                optionElement.value = value;
                optionElement.textContent = option;
                optionElement = Style.style(optionElement, [element.style_option, element.style_standard]);
                dataList.appendChild(optionElement);
            }
            
            e.appendChild(dataList);
            
            form.appendChild(e);

            return form;
        },
        parseLevel : 1,
        
        generate : "<base>",
        element : "input",

        style : "<dropdown>",
        style_option : "<dropdown>",
        style_standard : "<base>",
        style_border : "<base>",
        style_paddingMedium : "<base>",
        handleStyle : true,
    },
    {   // button
        name : "button",
        function : (info, element) => {
            info = Merge.dicts({
                callback : () => {console.warn("submit Element: missing callback function")},
                content : "Submit",
            }, info);

            Tester.dicts({
                callback : "function",
                content : ["string", "HTMLElement"],
            }, info, `${element.name} Element: `);


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

            let e = element.generate(info, element);
            
            e.addEventListener('click', info.callback);

            return e;
        },
        generate : "<base>",
        style : "<submit>",
        style_standard : "<base>",
        style_border : "<base>",
        style_paddingMedium : "<base>",
        element : "button"
    },
    {   // submit
        name : "submit",
        function : (info, element) => {
            info = Merge.dicts({
                callback : () => {console.warn("submit Element: missing callback function")},
                content : "Submit",
                form : "default",
            }, info);

            Tester.dicts({
                callback : "function",
                content : ["string", "HTMLElement"],
                form : "string",
            }, info, `${element.name} Element: `);

            let callback = () => {
                let formElements = document.querySelectorAll(`[data-form="${info.form}"]`);
                let output = {};
                for (let formElement of formElements) {
                    switch (formElement.dataset.type) {
                        case "textbox":
                        case "dropdown":
                        case "combo":
                            if (output[formElement.name] !== undefined) {
                                console.error(`submit Element: "${formElement.name}" is not a unique name`);
                                break;
                            }
                            output[formElement.name] = formElement.value;
                            break;
                        case "radio":
                            let name = "";
                            let value = "";
                            let radioButtons = formElement.querySelectorAll('input[type="radio"]');
                            for (let radio of radioButtons) {
                                if (radio.checked) {
                                    output[radio.name] = radio.value;
                                    break;
                                }
                            }
                            break;
                        case "checkbox":
                            let checkboxName = "";
                            let checkboxValue = [];
                            let checkboxButtons = formElement.querySelectorAll('input[type="checkbox"]');
                            for (let checkbox of checkboxButtons) {
                                if (checkbox.checked) {
                                    checkboxName = checkbox.name;
                                    checkboxValue.push(checkbox.value);
                                }
                            }
                            output[checkboxName] = checkboxValue;
                            break;
                        case "submit":
                            break;
                        default:
                            console.error("submit Element: Could not find type of form element");
                            console.debug(formElement);
                    }
                }
                info.callback(output);
            };

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

            let e = element.generate(info, element);
            e.dataset.form = info.form;
            e.dataset.type = element.name;
            
            e.addEventListener('click', callback);

            return e;
        },
        generate : "<base>",
        style : {
            color : "var(--standout4)",
            cursor : "pointer",

            backgroundColor : "var(--accent1)",
            hover_backgroundColor : "var(--accent2)",

            paddingTop : "var(--paddingSmall)",
            paddingBottom : "var(--paddingSmall)",
        },
        style_standard : "<base>",
        style_border : "<base>",
        style_paddingMedium : "<base>",
        element : "button"
    }
];

export class FallenInput {
    static getElements() {
        return elements;
    }
}
