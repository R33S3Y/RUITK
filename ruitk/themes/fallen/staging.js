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
            backgroundColor : "var(--standout4)",
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
                name : "",
                checked : false,
            }, info);

            let e = element.generate(info, element);
            e.type = "radio";
            e.name = info.name;
            e.checked = info.checked;

            return e;
        },
        generate : "<base>",
        style : {
            accentColor : "var(--accent1)",
            backgroundColor : "var(--standout4)",
        },
        style_standard : "<base>",
        style_paddingMedium : "<base>",
        element : "input"
    },
    {   // checkbox
        name : "checkbox",
        function : (info, element) => {
            info = Merge.dicts({
                checked : false,
            }, info);

            let e = element.generate(info, element);
            e.type = "checkbox";
            e.checked = info.checked;

            return e;
        },
        generate : "<base>",
        style : "<radio>",
        style_standard : "<base>",
        style_paddingMedium : "<base>",
        element : "input"
    },
    {   // dropdown
        name : "dropdown",
        function : (info, element) => {
            info = Merge.dicts({
                options : []
            }, info);

            let e = document.createElement("select");
            e.id = `${element.name}-${element.elementCount}`;

            for (let option of info.options) {
                let optionElement = document.createElement("option");
                optionElement.value = option.value || option;
                optionElement.textContent = option.label || option;
                e.appendChild(optionElement);
            }

            return e;
        },
        generate : "<base>",
        style : "<combo>",
        style_standard : "<base>",
        style_border : "<base>",
        style_paddingMedium : "<base>",
        element : "select"
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
            backgroundColor : "var(--standout4)",
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
