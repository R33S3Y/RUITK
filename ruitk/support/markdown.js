
export class Markdown {

    static markdown (str) {
        function tokenize (str) {
            let tokens = {
                true : [], // syntax
                false : [] // text
            };
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
                    item = "";
                    itemType = newItemType;
                }
                item += char;
            }
            tokens[itemType].push(item);
            tokens[!itemType].push("");
            
            return { syntax : tokens.true, text : tokens.false };
        }
        return tokenize(str);
    }
}