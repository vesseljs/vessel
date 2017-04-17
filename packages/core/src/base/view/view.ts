
export class View  {

    private _getClassName(): string {
        return this.constructor.name;
    }

    private _getMetadataKey() {
        return "__metadata__" + this._getClassName() + "__";
    }
}
