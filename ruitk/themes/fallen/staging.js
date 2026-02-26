import { Merge } from "../../support/merger.js";
import { Tester } from "../../support/tester.js";

let elements = [
    {    // search
        name: "search",
        function: (info, element) => {
            info = Merge.dicts({
                id : `"${element.name}-${element.elementCount}"`,
                callback : `(value) => {console.warn("search Element: missing callback function")}`, // I think this needs a revision and a rename.
            }, info);

            Tester.dicts({
                id : { type: "string", full: true },
                callback : { type: "string", full: true },
            }, info, `${element.name} Element: `);

            let textboxInfo = JSON.parse(JSON.stringify(info));


            let textboxInfoStr = "";
            for (let key in textboxInfo) {
                textboxInfoStr += `${key} : ${textboxInfo[key]}, `;
            }

            let e = element.makeElements(`<textbox>{${textboxInfoStr}}`);

            info.callback = element.parse(info.callback);

            function handleKeyDown(event, callback) {
                if (event.key === "Enter") {
                    event.preventDefault(); // Prevents new lines in multi-line inputs
            
                    const input = event.target;
                    const lastValue = input.dataset.lastValue || "";
            
                    if (input.value !== lastValue) {
                        input.dataset.lastValue = input.value; // Update stored value
                        callback(input.value);
                    }
                }
            }
            e.addEventListener("keydown", (event) => handleKeyDown(event, info.callback));
            
            let icon = element.makeElements(`<icon>{name : "editFind", color : "var(--accent1)",
            hover_color : "var(--accent2)", size : "var(--fontSizeH2)", c : 2, r : 2}`);
            function handleClick(callback) {
                const input = document.getElementById(element.parse(info.id));
                const lastValue = input.dataset.lastValue || "";
            
                if (input.value !== lastValue) {
                    input.dataset.lastValue = input.value; // Update stored value
                    callback(input.value);
                }
            }
            icon.addEventListener("click", () => handleClick(info.callback));

            e.appendChild(icon);

            return e;
        },
        style: {
        
        },
        style_standard : "<base>",
        parseLevel : 1, 
    }, { // markdown
        name: "markdown",
        function: (info, element) => {
            info = Merge.dicts({
                str : "",
            }, info);

            Tester.dicts({
                str : { type: "string", full: true },
            }, info, `${element.name} Element: `);

            let markdownStr = "\n" + info.str + "\n";

            let status = {
                h : {enable : false, element : ""},
                b : {enable : false, element : ""},
                i : {enable : false, element : ""},
                u : {enable : false, element : ""},
                a : {enable : false, element : ""},
            };
            let ruitkStr = "";
            let result;
            for (let i = 0; i < markdownStr.length; i++) {
                switch(markdownStr[i]) {
                    case "\n": //headings
                    case "*":
                    case " ":
                    case "_":
                    case "[":
                    case "]":
                    case "(":
                    case ")":
                    case "#":
                        let ref = ruitkStr.length;

                        result = general(markdownStr, i, status);
                        ruitkStr += result.str;
                        i = i + result.offset; 

                        result = headings(markdownStr, i, status);
                        ruitkStr += result.str;
                        i = i + result.offset; 

                        result = boldItalic(markdownStr, i, status); 
                        ruitkStr += result.str;
                        i = i + result.offset; 

                        result = link(markdownStr, i, status, ruitkStr); 
                        ruitkStr += result.str;
                        i = i + result.offset; 

                        if (ruitkStr.length === ref) {
                            ruitkStr += markdownStr[i];
                        }
                        break;
                    default:
                        ruitkStr += markdownStr[i];
                        break;
                }
            }
            ruitkStr += closeAll(status);
            ruitkStr = ruitkStr.trim();
            
            return element.makeElements(`<p1>{"content" : "${ruitkStr}"}`);

        },
        handleStyle : true,
        dependencys : [ "test1", "test2" ],
    }
];

export class FallenStaging {
    static getElements() {
        return elements;
    }
}


function close(status, key) {
    let ruitkStr = `" `;

    ruitkStr += lazyCloseAll(status);
    status[key].enable = false;
    ruitkStr += lazyOpenAll(status);

    ruitkStr += `"`;
    return ruitkStr;
}
function open(status, key, element) {
    let ruitkStr = `" `;

    ruitkStr += lazyCloseAll(status);
    status[key] = {
        enable : true,
        element : element
    }
    ruitkStr += lazyOpenAll(status);

    ruitkStr += `"`;

    return ruitkStr;
}
function toggle (status, key, element) {
    if (status[key].enable === true) {
        return close(status, key);
    } else {
        return open(status, key, element);
    }

}
function closeAll(status) {
    let ruitkStr = lazyCloseAll(status);

    for (let key of Object.keys(status)) {
        if (status[key].enable === true) {
            status[key].enable = false;
        }
    }

    if (ruitkStr.length !== 0) {
        ruitkStr = `" ` + ruitkStr + `"\n`;
    }

    return ruitkStr;
}
function lazyCloseAll(status) {
    let ruitkStr = "";
    for (let key of Object.keys(status)) {
        if (status[key].enable === true) {
            ruitkStr += `} `;
        }
    }
    
    return ruitkStr;
}
function lazyOpenAll(status) {
    let ruitkStr = "";
    for (let key of Object.keys(status)) {
        if (status[key].enable === true) {
            ruitkStr += status[key].element;
        }
    }
    
    return ruitkStr;
}

function general(markdownStr, i, status) {
    if (markdownStr.startsWith("\n\n", i)) {
        return { str : closeAll(status), offset : 0 };
    }
    if (status.h.enable === true && markdownStr[i] === "\n") {
        return { str : close(status, "h"), offset : 0 };
    }
    return { str : "", offset : 0 };
}
function headings(markdownStr, i, status) {
    let ruitkStr = "\n";
    if (markdownStr.startsWith("\n# ", i)) {
        ruitkStr += open(status, "h", `<h1>{"content" : `);
        return { str : ruitkStr, offset : 2 };
    }
    if (markdownStr.startsWith("\n## ", i)) {
        ruitkStr += open(status, "h", `<h2>{"content" : `);
        return { str : ruitkStr, offset : 3 };
    }
    if (markdownStr.startsWith("\n### ", i)) {
        ruitkStr += open(status, "h", `<h3>{"content" : `);
        return { str : ruitkStr, offset : 4 };
    }
    if (markdownStr.startsWith("\n#### ", i)) {
        ruitkStr += open(status, "h", `<h3>{"content" : `);
        return { str : ruitkStr, offset : 5 };
    }
    if (markdownStr.startsWith("\n##### ", i)) {
        ruitkStr += open(status, "h", `<h3>{"content" : `);
        return { str : ruitkStr, offset : 6 };
    }
    if (markdownStr.startsWith("\n###### ", i)) {
        ruitkStr += open(status, "h", `<h3>{"content" : `);
        return { str : ruitkStr, offset : 7 };
    }
    return { str : "", offset : 0 };
}
function boldItalic(markdownStr, i, status) {
    let ruitkStr = "";

    if (/[^A-Za-z0-9_]___/.test(markdownStr.slice(i - 1, i + 3))) {
        ruitkStr += open(status, "i", `<i>{"content" : `);
        ruitkStr += open(status, "b", `<b>{"content" : `);
        return { str : ruitkStr, offset : 2 };
    }
    if (/___[^A-Za-z0-9_]/.test(markdownStr.slice(i , i + 4))) {
        ruitkStr += close(status, "i");
        ruitkStr += close(status, "b");
        return { str : ruitkStr, offset : 2 };
    }

    if (/[^A-Za-z0-9_]__/.test(markdownStr.slice(i - 1, i + 2)) && status.b.enable === false) {
        ruitkStr += open(status, "b", `<b>{"content" : `);
        return { str : ruitkStr, offset : 1 };
    }
    if (/__[^A-Za-z0-9_]/.test(markdownStr.slice(i , i + 3)) && status.b.enable === true) {
        ruitkStr += close(status, "b");
        return { str : ruitkStr, offset : 1 };
    }
    if (markdownStr.startsWith("**", i)) {
        return { str : toggle(status, "b", `<b>{"content" : `), offset : 1 };
    }


    if (/[^A-Za-z0-9_]_/.test(markdownStr.slice(i - 1, i + 1)) && status.i.enable === false) {
        ruitkStr += open(status, "i", `<i>{"content" : `);
        return { str : ruitkStr, offset : 0 };
    }
    if (/_[^A-Za-z0-9_]/.test(markdownStr.slice(i , i + 2)) && status.i.enable === true) {
        ruitkStr += close(status, "i");
        return { str : ruitkStr, offset : 0 };
    }
    if (markdownStr.startsWith("*", i)) {
        return { str : toggle(status, "i", `<i>{"content" : `), offset :  0 };
    }


    return { str : "", offset : 0 };
}
function link(markdownStr, i, status, ruitkStr) {
    let outStr = "";
    if (tokenRoughReduceStr(markdownStr.slice(i), ["[", "](", ")", "\n"]).startsWith("[]()") && markdownStr[i] === "[") {
        outStr += open(status, "a", `<a>{"content" : `);
        return { str : outStr, offset : 0 };
    }
    if (markdownStr.startsWith("](", i) && status.a.enable === true) {
        if (ruitkStr[ ruitkStr.length - 1] === '"') outStr += "[]";
        outStr += `", href : "`;
        return { str : outStr, offset : 1 };
    }
    if (markdownStr.startsWith(")", i) && status.a.enable === true) {
        outStr += close(status, "a");
        return { str : outStr, offset : 0 };
    }

    return { str : "", offset : 0 };
}

function tokenRoughReduceStr(str = "", tokens) { // makes a list of 
    tokens = tokens.sort((a, b) => b.length - a.length);
    let strs = [];
    for (let i = 0; i < tokens.length; i++) {
        let j = str.indexOf(tokens[i]);
        if (j === -1) {
            continue;
        }
        strs.push({ str : str.slice(j, j + tokens[i].length), j : j });
        str.replace(tokens[i], "");
    }
    strs = strs.sort((a, b) => a.j - b.j);
    let out = "";
    for (let i = 0; i < strs.length; i++) {
        out += strs[i].str;
    }
    return out;
}