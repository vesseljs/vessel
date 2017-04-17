/**
 * Vessel's Main class.
 *
 * Models, views, collections
 * will inherit this class.
 */
export class Vessel {
    public version;

    constructor() {
        this.version = "0.0.1-pre";
    }

    private _getClassName(): string {
        return this.constructor.name;
    }
}


