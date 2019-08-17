export class SquareGroup {
    name: string;
    squarePool: Array<string> = [];
    constructor(name: string, squarePool: Array<string>) {
        this.name = name;
        this.squarePool = squarePool;
    }
}
