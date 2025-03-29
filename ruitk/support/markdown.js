
// Incomplete

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

let element = { // markdown
    name: "markdown",
    function: (info, element) => {
        info = Merge.dicts({
            str : "",
        }, info);

        let elements = [];

        function findElement(str, pattern, type) {
            let matches = [];
            let match;
            
            while ((match = pattern.exec(str)) !== null) {
                matches.push({ str : match[0], content : match[1], index : match.index, type : type});
            }
            
            return matches;
        }

        /**
         * please note: This is intend to work the same as obsidain during edge cases
         * with the following exemptions
         *  - no incomplete statements Eg *italic
         */
        

        // headings
        elements.concat(findMatches(info.str, /^#\s+(.+)$/gm, "h1"));
        elements.concat(findMatches(info.str, /^##\s+(.+)$/gm, "h2"));
        elements.concat(findMatches(info.str, /^###\s+(.+)$/gm, "h3"));
        elements.concat(findMatches(info.str, /^####\s+(.+)$/gm, "h4"));
        elements.concat(findMatches(info.str, /^#####\s+(.+)$/gm, "h5"));
        elements.concat(findMatches(info.str, /^######\s+(.+)$/gm, "h6"));

        elements.concat(findMatches(info.str, /^(.+)\n=+$/gm, "h1"));
        elements.concat(findMatches(info.str, /^(.+)\n--+$/gm, "h2"));

        // bold
        elements.concat(findMatches(info.str, /\*\*([^\*]+)\*\*/gm, "b"));
        elements.concat(findMatches(info.str, /\s__(.+?)__\s/gm, "b"));

        // italic

        
    },
    style: {
        
    },
    style_standard : "<base>",
};