import { AttribProxy } from './proxy';
import { isArrayEmpty } from '@vessel/core';
import { ModelInterface } from '@vessel/types/definitions';

/**
 * BaseModel class
 */
export class Model implements ModelInterface {

    /**
     * Stores the names of the attributes, so
     * the framework knows about them.
     */
    private className = this._getClassName();
    private metadataKey = "__metadata__" + this.className + "__";

    /**
     * Stores the attribute proxy.
     */
    protected attr: any;

    public constructor() {
        this._createProxy();
    }

    /**
     * Provides a way to set multiple
     * attributes at once.
     *
     * @param attrs
     */
    // TODO - Validation within set
    public set( attrs ) {
        for (let attr in attrs) {
            this.attr[attr] = attrs[attr];
        }
    }

    /**
     * Instances the attribute proxy, it adds each
     * attribute defined in the model with the
     * 'attr' decorator to the proxy.
     * @private
     */
    protected _createProxy() {
        if ( isArrayEmpty(this.metadataKey) )
            throw TypeError("Attempt to create a proxy" +
                " with no metadata.");

        this.attr = new AttribProxy();
        for (let attrName of this.metadataKey) {
            this.attr.addAttribute(attrName);
        }
    }

    /**
     * Whenever a validation takes place, this
     * function will be invoked. All built-in
     * general validations will be checked here.
     *
     * This function is responsible for return
     * the results of the custom defined
     * validationFn.
     *
     * @param value
     * @param validationFn
     * @returns boolean
     * @private
     */
    protected _validate( value, validationFn ) {
        return validationFn(value);
    }

    private _getClassName(): string {
        return this.constructor.name;
    }

}