import { defineProp } from 'core';
/**
 * Attribute proxy.
 *
 * Intercepts each setter/getter of
 * each model's attribute so it can
 * trigger events.
 */
var AttribProxy = (function () {
    function AttribProxy() {
        /**
         * Stores the state of the
         * model's attributes.
         *
         * @type {any{} }
         */
        this.data = {};
    }
    /**
     * Setups a new attribute, installs
     * the getter and setter interceptors.
     *
     * @param name
     */
    AttribProxy.prototype.addAttribute = function (name) {
        this.data[name] = "";
        defineProp(this, name, function getter() {
            return this.data[name];
        }, function setter(value) {
            this.data[name] = value;
        });
    };
    return AttribProxy;
}());
export { AttribProxy };
//# sourceMappingURL=proxy.js.map