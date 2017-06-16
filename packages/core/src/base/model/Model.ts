import { AttribProxy } from './Proxy';
import { Vessel, isArrayEmpty, each, toInitialUpperCase, BaseTypes } from '@vessel/core';
import { ModelInterface } from '@vessel/types/definitions';

/**
 * BaseModel class
 */
export class Model extends Vessel implements ModelInterface {

    protected _type = BaseTypes.MODEL;

    /**
     * Stores the bridge service.
     */
    protected bridge: string;

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

    public save() {
        let bridge = this.getBridge();
        if (this.isNew()) {
            return bridge.post(this);
        }
        return bridge.put(this);
    }

    public fetch() {
        return this.getBridge().get(this);
    }

    public remove() {
        return this.getBridge().remove(this);
    }

    public getIdentifier() {
        let attrName = this
            .get('@metadata_manager')
            .getIdentifier(this.getClassName());
        return this[attrName];
    }

    protected isNew() {
        return !this.getIdentifier();
    }

    /**
     * Instances the attribute proxy, it adds each
     * attribute defined in the model with the
     * 'attr' decorator to the proxy.
     * @private
     */
    protected _createProxy() {
        let attrs,
            metadataManager = this.get('@metadata_manager');

        attrs = metadataManager.getAttributes(this.getClassName());

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

    protected getBridge() {
        return this.get(this.bridge);
    }

}