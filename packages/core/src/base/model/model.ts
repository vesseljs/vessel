import { AttribProxy } from './proxy';
import { ModelInterface } from '../interfaces';
import { isArrayEmpty } from '@vessel/common/utils/src/utilities';

export class Model implements ModelInterface {

    public __metadata__;
    protected attr: any;

    public constructor() {
        this._createProxy();
    }

    // TODO - Validation in set
    public set( attribs ) {
        for (let attrib in attribs) {
            this.attr[attrib] = attribs[attrib];
        }
    }

    protected _createProxy() {
        if ( isArrayEmpty(this.__metadata__) )
            throw TypeError("Attempt to create a proxy" +
                " with no metadata.");

        this.attr = new AttribProxy();
        for (let attrName of this.__metadata__) {
            this.attr.addAttribute(attrName);
        }
    }

    protected _validate( value, validationFn ) {
        return validationFn(value);
    }

    private _getClassName(): string {
        return this.constructor.name;
    }

}

// Metadata needs to be directly declared
// so it already exists in the prototype
// when the decorator runs.
Model.prototype.__metadata__ = [];