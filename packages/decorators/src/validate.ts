import {isFunction} from "@vessel/core";
/**
 * Decorator: @validate( <validate function> )
 *
 * Alters the original setter so each time
 * it is invoked it will proceed as follows:
 *
 *  1. Calls the built-in _validate function. This
 *  is a built-in framework function, responsible
 *  for general validation.
 *  2. The _validation function will delegate to
 *  the given validate function
 *  3. If the passed in validate function returns
 *  true it'll execute the setter.
 *  *3b. If the validate function results in false,
 *  The new value will not be setted.
 *
 * @param validationFn
 * @returns descriptor object
 */
export function validate(validationFn) {
    return function(proto, setterName, descriptor) {
        if ( !isFunction(validationFn) ) {
            throw TypeError("The @validate() decorator, " +
                "applied to '" + setterName + "()', requires a " +
                "valid validator function as parameter to be " +
                "passed in.");
        }

        let boundFn = descriptor.value;
        descriptor.value = function setAttribute(value) {
            if ( this._validate(value, validationFn) ) {
                boundFn.call(this, value);
            }
        }
        return descriptor;
    }
}