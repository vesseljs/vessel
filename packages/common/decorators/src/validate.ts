import { isFunction } from "@vessel/common/utils";

export function validate(validationFn ) {
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