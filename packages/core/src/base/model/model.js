var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { AttribProxy } from './proxy';
import { isArrayEmpty } from '@vessel/common/utils/src/utilities';
import { Vessel } from '../vessel';
/**
 * BaseModel class
 */
var Model = (function (_super) {
    __extends(Model, _super);
    function Model() {
        var _this = _super.call(this) || this;
        _this._createProxy();
        return _this;
    }
    /**
     * Provides a way to set multiple
     * attributes at once.
     *
     * @param attrs
     */
    // TODO - Validation within set
    Model.prototype.set = function (attrs) {
        for (var attr in attrs) {
            this.attr[attr] = attrs[attr];
        }
    };
    /**
     * Instances the attribute proxy, it adds each
     * attribute defined in the model with the
     * 'attr' decorator to the proxy.
     * @private
     */
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
    Model.prototype._validate = function (value, validationFn) {
        return validationFn(value);
    };
    Model.prototype._getClassName = function () {
        return this.constructor.name;
    };
    return Model;
}(Vessel));
export { Model };
// Since decorators are executed at runtime
// and __metadata__ is an array which is used
// by the @attr decorator, __metadata__ needs
// to be declared outside the class.
// Otherwise, the push method that the decorator
// uses will throw an error.
Model.prototype.__metadata__ = [];
Model.prototype.__dependencies__ = [];
//# sourceMappingURL=model.js.map