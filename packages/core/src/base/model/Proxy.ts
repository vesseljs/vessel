import { defineProp } from '@vessel/core';

/**
 * Attribute proxy.
 *
 * Intercepts each setter/getter of
 * each model's attribute so it can
 * trigger events.
 */
export class AttribProxy {

    /**
     * Stores the state of the
     * model's attributes.
     *
     * @type {any{} }
     */
    public data = <any>{};

    /**
     * Setups a new attribute, installs
     * the getter and setter interceptors.
     *
     * @param name
     */
    public addAttribute( name: string ) {
        this.data[name] = "";
        defineProp(this, name,
            function getter() {
                return this.data[name];
            },
            function setter( value ) {
                this.data[name] = value;
            }
        )
    }

}