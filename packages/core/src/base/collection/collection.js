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
import { isArray, filterOne, filter, matchPair, map } from '@vessel/core';
import { Vessel } from '../vessel';
var prefixAttr = 'attr';
var Collection = (function (_super) {
    __extends(Collection, _super);
    function Collection() {
        return _super.call(this) || this;
    }
    Collection.prototype.add = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var collection = this.getCollection(), Model = this.getModel();
        try {
            collection.push(new (Model.bind.apply(Model, [void 0].concat(args)))());
        }
        catch (e) {
            if (e instanceof TypeError) {
                if (!isArray(collection)) {
                    console.error("TypeError: The collection '" +
                        this.__metadata__ + "' (" + typeof collection +
                        ") must be an array.");
                }
            }
        }
    };
    Collection.prototype.find = function (attrs) {
        return filterOne(this.getCollection(), function (item) {
            return matchPair(item[prefixAttr], attrs);
        });
    };
    Collection.prototype.findAll = function (attrs) {
        return filter(this.getCollection(), function (item) {
            return matchPair(item[prefixAttr], attrs);
        });
    };
    Collection.prototype.pull = function (attrName) {
        return map(this.getCollection(), function (item) {
            return item[prefixAttr][attrName];
        });
    };
    Collection.prototype.sort = function () {
    };
    Collection.prototype.remove = function () {
    };
    Collection.prototype.removeById = function () {
    };
    Collection.prototype.update = function () {
    };
    Collection.prototype.save = function () {
    };
    Collection.prototype.fetch = function () {
    };
    Collection.prototype.willRetrieve = function () {
        return this;
    };
    Collection.prototype.getCollection = function () {
        return this[this.__metadata__];
    };
    return Collection;
}(Vessel));
export { Collection };
Collection.prototype.__dependencies__ = [];
//# sourceMappingURL=collection.js.map