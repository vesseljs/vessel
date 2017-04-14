import { AttribProxy } from './proxy';
import { ModelInterface } from '../interfaces';
import { isArrayEmpty } from '@vessel/common/utils/src/utilities';

/**
 * BaseModel class
 */
export class Model implements ModelInterface {

    /**
     * Stores the names of the attributes, so
     * the framework knows about them.
     */
    public __metadata__;

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
        if ( isArrayEmpty(this.__metadata__) )
            throw TypeError("Attempt to create a proxy" +
                " with no metadata.");

        this.attr = new AttribProxy();
        for (let attrName of this.__metadata__) {
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

// Since decorators are executed at runtime
// and __metadata__ is an array which is used
// by the @attr decorator, __metadata__ needs
// to be declared outside the class.
// Otherwise, the push method that the decorator
// uses will throw an error.

Model.prototype.__metadata__ = [];