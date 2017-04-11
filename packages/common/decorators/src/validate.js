export function validate(validationFn) {
    if (validationFn === void 0) { validationFn = null; }
    return function (modelPrototype, attribName, descriptor) {
        var boundFn = descriptor.value;
        descriptor.value = function setter(value) {
            if (this._validate(value, validationFn))
                boundFn.call(this, value);
        };
        return descriptor;
    };
}
//# sourceMappingURL=validate.js.map