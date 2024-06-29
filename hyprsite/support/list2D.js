
export class List2D {
    static create(xLength, yLength, value) {
        let list = [];
        for (let x = 0; x < xLength; x++) {
            list.push(Array(yLength).fill(value));
        }
        return list
    }

    static getListY(x, list) {
        return list[x];
    }

    static getListX(y, list) {
        let values = [];
        for (let x in list) {
            values.push(list[x][y]);
        }
        return values;
    }
}

