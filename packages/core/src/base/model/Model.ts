import { AttribProxy } from './Proxy';
import { Vessel, isArrayEmpty, each, toInitialUpperCase } from '@vessel/core';
import { ModelInterface } from '@vessel/types/definitions';

/**
 * BaseModel class
 */
export class Model extends Vessel implements ModelInterface {

    /**
     * Stores the attribute proxy.
     */
    protected attr: any;

    public constructor() {
        super();
        this._createProxy();
    }

    /**
     * Provides a way to set multiple
     * attributes at once.
     *
     * @param attrs
     */
    public set( attrs ) {
        each(attrs, function(attrName, value){
            let boundFn = this['set' + toInitialUpperCase(attrName)];
            boundFn.call(this, value);
        }, this);
        return this;
    }

    /**
     * Instances the attribute proxy, it adds each
     * attribute defined in the model with the
     * 'attr' decorator to the proxy.
     * @private
     */
    protected _createProxy() {
        let attrs,
            metadaManager = this.get('@metadata_manager');

        attrs = metadaManager.getAttributes(this.getClassName());

        if ( isArrayEmpty(attrs) ) {
            throw TypeError("Attempt to create a proxy" +
                " with no metadata.");
        }

        this.attr = new AttribProxy();

        each(attrs, function(attrName) {
            this.attr.addAttribute(attrName);
        }, this);
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

    public save() {

    }

    public fetch() {

    }

}