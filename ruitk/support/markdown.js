
export class Markdown {

    static markdown (str) {
        function tokenize (str) {
            let tokens = {
                true : [], // syntax
                false : [] // text
            };
            let all = [];
            let item = "";
            let itemType = false;
            for (let char of str) {
                let newItemType = "";
                if (char === "#" || char === "*" || char === "_" || 
                    char === " " || char === "\n" || char === "-" || 
                    char === "[" || char === "]" || char === "`") {
                    newItemType = true;
                } else {
                    newItemType = false;
                }
                if (newItemType !== itemType && item !== "") {
                    tokens[itemType].push(item);
                    tokens[!itemType].push("");
                    all.push(item);
                    item = "";
                    itemType = newItemType;
                }
                item += char;
            }
            tokens[itemType].push(item);
            tokens[!itemType].push("");
            all.push(item);
            
            return { syntax : tokens.true, text : tokens.false, all : all };
        }

        let tokens = tokenize(str);
        let status = {
            h1 : {},
            h2 : {},
            h3 : {},
            h4 : {},
            h5 : {},
            h6 : {},
            b : {},
            a : {},
            i : {},
        };

        for (let i = 0; i < tokens.syntax.length; i++) {
            if ( tokens.syntax[i] === "") {

            }
            
        }
    }
}