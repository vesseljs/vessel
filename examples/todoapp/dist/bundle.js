function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function isSupported(feature) {
    return typeof feature == 'function';
}
function isArray(arr) {
    return Array.isArray(arr);
}
function isArrayEmpty(arr) {
    return arr.length === 0;
}

function isFunction(fn) {
    if (fn == undefined)
        return false;
    if (typeof fn !== "function")
        return false;
    return true;
}
function defineProp(obj, prop, getter, setter) {
    var descriptor = {
        enumerable: false,
        configurable: true,
        set: setter,
        get: getter
    };
    Object.defineProperty(obj, prop, descriptor);
}

var App = (function () {
    function App() {
    }
    App.prototype.browserBoot = function () {
        window.$Vessel = this;
        this.detectBrowserFeatures()
            .loadContainer();
        return this;
    };
    App.prototype.detectBrowserFeatures = function () {
        window.$Vessel.can = {
            WeakMap: isSupported(window.WeakMap)
        };
        return this;
    };
    // TODO - WeakMap fallback
    App.prototype.loadContainer = function () {
        this.container =
            window.$Vessel.can.WeakMap ?
                new WeakMap() :
                "Dev: WeakMap fallback - work in progress";
        return this;
    };
    return App;
}());

var AttribProxy = (function () {
    function AttribProxy() {
        this.data = {};
    }
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

var Model = (function () {
    function Model() {
        this._createProxy();
    }
    // TODO - Validation in set
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
        return validationFn(value);
    };
    Model.prototype._getClassName = function () {
        return this.constructor.name;
    };
    return Model;
}());
// Metadata needs to be directly declared
// so it already exists in the prototype
// when the decorator runs.
Model.prototype.__metadata__ = [];

var Collection = (function () {
    function Collection() {
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
                        ")must be an array.");
                }
            }
        }
    };
    Collection.prototype.find = function () {
    };
    Collection.prototype.findOne = function () {
    };
    Collection.prototype.findById = function () {
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
        var collection = this[this.__metadata__];
        return collection;
    };
    return Collection;
}());

function attr(proto, attribName) {
    proto.__metadata__.push(attribName);
}

function validate(validationFn) {
    return function (proto, setterName, descriptor) {
        if (!isFunction(validationFn)) {
            throw TypeError("The @validate() decorator, " +
                "applied to '" + setterName + "()', requires a " +
                "valid validator function as parameter to be " +
                "passed in.");
        }
        var boundFn = descriptor.value;
        descriptor.value = function setAttribute(value) {
            if (this._validate(value, validationFn)) {
                boundFn.call(this, value);
            }
        };
        return descriptor;
    };
}

function collection(proto, attribName) {
    proto.__metadata__ = attribName;
}

var TodoModel = (function (_super) {
    __extends(TodoModel, _super);
    function TodoModel(author, body) {
        var _this = _super.call(this) || this;
        _this.setAuthor(author);
        _this.setBody(body);
        return _this;
    }
    TodoModel.prototype.getAuthor = function () {
        return this.attr.author;
    };
    TodoModel.prototype.setAuthor = function (value) {
        this.attr.author = value;
    };
    TodoModel.prototype.getBody = function () {
        return this.attr.body;
    };
    TodoModel.prototype.setBody = function (value) {
        this.attr.body = value;
    };
    return TodoModel;
}(Model));
__decorate([
    attr
], TodoModel.prototype, "author", void 0);
__decorate([
    attr
], TodoModel.prototype, "body", void 0);
__decorate([
    attr
], TodoModel.prototype, "date", void 0);
__decorate([
    validate(function validateAuthor(value) {
        if (!(value.length >= 3 && value.length <= 20)) {
            console.warn("Author length must be greater " +
                "than 3 characters or less than 20.");
            return false;
        }
        return true;
    })
], TodoModel.prototype, "setAuthor", null);
__decorate([
    validate(function (value) {
        if (!(value.length >= 0 && value.length <= 120)) {
            throw TypeError("Body length must be less " +
                "than 120 characters and must not be empty.");
        }
        return true;
    })
], TodoModel.prototype, "setBody", null);

//inject()
var TodoCollection = (function (_super) {
    __extends(TodoCollection, _super);
    function TodoCollection() {
        return _super.call(this) || this;
    }
    TodoCollection.prototype.getModel = function () {
        return TodoModel;
    };
    return TodoCollection;
}(Collection));
__decorate([
    collection
], TodoCollection.prototype, "todos", void 0);

var app = new App().browserBoot();
app.x = new TodoModel('pe', 'body 1');
app.y = new TodoModel('alex', 'body 2');
app.collection = new TodoCollection();
app.collection.add('pedro!', 'body 1');
//# sourceMappingURL=bundle.js.map
