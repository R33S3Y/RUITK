
export class Console {
    static types = ["debug", "log", "info", "warn", "error"];
    static original = {};
    static store = {};
    static muted = false;

    static take() {
        if (Object.keys(this.original).length !== 0) {
            console.error("Console.take function: Console is already taken. Please free console before taking again");
            return;
        }
        
        for (let type of this.types) {
            this.original[type] = console[type];
            this.store[type] = [];

            console[type] = (...args) => {
                this.store[type].push(args.join(" "));
                if (this.muted === false) {
                    this.original[type].apply(console, args);
                }
            }
        }
    }
    
    static free() {
        for (let type of this.types) {
            console[type] = this.original[type];
        }
        this.original = {};
        this.muted = false;
    }

    static clear() {
        this.store = {};
    }

    static dump() {
        if (Object.keys(this.store).length === 0) {
            return;
        }
        for (let type of this.types) {
            for (let i = 0; i < this.store[type].length; i++) {
                if (Object.keys(this.original).length !== 0) {
                    this.original[type].apply(console, this.store[type][i]);
                } else {
                    console[type](this.store[type][i]);
                }
            }
        }
    }
}