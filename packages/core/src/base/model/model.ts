import { AttribProxy } from './proxy';
import { ModelInterface } from "../interfaces";


export class Model implements ModelInterface {

    public __metadata__ = [];
    protected attr: any;

    public constructor() {
        this._createProxy();
    }

    public set( attribs ) {
        for (let attrib in attribs) {
            this.attr[attrib] = attribs[attrib];
        }
    }

    protected _createProxy() {
        this.attr = new AttribProxy();
        for (let attrName of this.__metadata__) {
            this.attr.addAttribute(attrName);
        }
    }

}

// Metadata needs to be directly declared
// so it already exists in the prototype
// when the decorator runs.
Model.prototype.__metadata__ = [];