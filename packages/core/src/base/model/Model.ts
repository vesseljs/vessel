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

    public save(requestOptions=null) {
        let bridge = this.getBridge();
        if (this.isNew()) {
            return bridge.createRequest(this, requestOptions);
        }
        return bridge.updateRequest(this, requestOptions);
    }

    public fetch(requestOptions=null) {
        return this.getBridge().readRequest(this, requestOptions=null);
    }

    public remove(requestOptions=null) {
        return this.getBridge().destroyRequest(this, requestOptions=null);
    }

    public getIdentifier() {
        let attrName = this
            .get('@metadata_manager')
            .getIdentifier(this.getClassName());
        return this.attr[attrName];
    }

    public getAttrs() {
        return this.attr.getAttrs();
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
        let bridge = this.bridge;

        if (!bridge) {
            throw new TypeError("Bridge does not exist. Define a bridge " +
                "for " + this.getClassName());
        }
        return this.get(bridge);
    }

}