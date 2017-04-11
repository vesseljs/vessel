import { AttribProxy } from './proxy';
import { isArrayEmpty } from '@vessel/common/utils/src/utilities';
export var Model = (function () {
    function Model() {
        this._createProxy();
    }
    Model.prototype.set = function (attribs) {
        for (var attrib in attribs) {
            this.attr[attrib] = attribs[attrib];
        }
    };
    Model.prototype._createProxy = function () {
        if (isArrayEmpty(this.__metadata__))
            throw TypeError("Attempt to create a proxy" +
                " with no metadata.");
        this.attr = new AttribProxy();
        for (var _i = 0, _a = this.__metadata__; _i < _a.length; _i++) {
            var attrName = _a[_i];
            this.attr.addAttribute(attrName);
        }
    };
    Model.prototype._validate = function (value, validationFn) {
        var result;
        console.log('Validating! ' + value);
        if (validationFn) {
            result = validationFn.call(this, null);
        }
        else {
            result = this.validate();
        }
        return true;
    };
    return Model;
}());
// Metadata needs to be directly declared
// so it already exists in the prototype
// when the decorator runs.
Model.prototype.__metadata__ = [];
//# sourceMappingURL=model.js.map