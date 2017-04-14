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
function getKeys(obj) {
    return Object.keys(obj);
}
function each(obj, fn, context) {
    if (context === void 0) { context = null; }
    var i, len, keys, item;
    if (isArray(obj)) {
        for (i = 0, len = obj.length; i < len; i++) {
            fn.call(context, obj[i], i, obj);
        }
    }
    else {
        keys = getKeys(obj);
        for (i = 0, len = keys.length; i < len; i++) {
            item = keys[i];
            fn.call(context, item, obj[item], obj);
        }
    }
    return obj;
}
function matchPair(obj, attrs) {
    var keys = getKeys(attrs), len = keys.length, key, i;
    for (i = 0; i < len; i++) {
        key = keys[i];
        if (attrs[key] !== obj[key] || !(key in obj))
            return false;
    }
    return true;
}
function map(arr, fn, context) {
    if (context === void 0) { context = null; }
    var newArr = [], result;
    each(arr, function (item, index) {
        result = fn.call(context, item, index);
        if (result)
            newArr.push(result);
    });
    return newArr;
}
function filter(obj, fn, context) {
    if (context === void 0) { context = null; }
    var matches = [];
    each(obj, function (item, index) {
        if (fn.call(context, item, index, obj))
            matches.push(item);
    });
    return matches;
}
function filterOne(arr, fn, context) {
    if (context === void 0) { context = null; }
    var i, item, len = arr.length;
    for (i = 0; i < len; i++) {
        if (fn.call(context, item = arr[i], i, arr))
            return item;
    }
    return false;
}

var App = (function () {
    function App() {
    }
    App.prototype.browserBoot = function () {
        this.detectBrowserFeatures();
        this.loadContainer();
        return this;
    };
    App.prototype.detectBrowserFeatures = function () {
        this.can = {
            WeakMap: isSupported(window.WeakMap)
        };
        return this;
    };
    // TODO - WeakMap fallback
    App.prototype.loadContainer = function () {
        this.container =
            this.can.WeakMap ?
                new WeakMap() :
                "Dev: WeakMap fallback - work in progress";
        return this;
    };
    return App;
}());

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

/**
 * BaseModel class
 */
var Model = (function () {
    function Model() {
        this._createProxy();
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
}());
// Since decorators are executed at runtime
// and __metadata__ is an array which is used
// by the @attr decorator, __metadata__ needs
// to be declared outside the class.
// Otherwise, the push method that the decorator
// uses will throw an error.
Model.prototype.__metadata__ = [];

var prefixAttr = 'attr';
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
}());

/**
 * Decorator: @attr
 *
 * Adds the names of the custom attributes to
 * <ModelPrototype>.__metadata__. This will
 * be used by the framework so it knows what
 * are the model attributes that it will need.
 *
 * @param proto
 * @param attrName
 */
/**
 * Decorator: @attr
 *
 * Adds the names of the custom attributes to
 * <ModelPrototype>.__metadata__. This will
 * be used by the framework so it knows what
 * are the model attributes that it will need.
 *
 * @param proto
 * @param attrName
 */ function attr(proto, attrName) {
    proto.__metadata__.push(attrName);
}

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

/**
 * Decorator: @collection
 *
 * Adds the name of the custom attribute to
 * <CollectionPrototype>.__metadata__. This
 * will be used by the framework so it knows
 * what is the collection attribute which
 * will store the models.
 *
 * @param proto
 * @param attrName
 */
/**
 * Decorator: @collection
 *
 * Adds the name of the custom attribute to
 * <CollectionPrototype>.__metadata__. This
 * will be used by the framework so it knows
 * what is the collection attribute which
 * will store the models.
 *
 * @param proto
 * @param attrName
 */ function collection(proto, attrName) {
    proto.__metadata__ = attrName;
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
        var _this = _super.call(this) || this;
        _this.todos = [];
        return _this;
    }
    TodoCollection.prototype.getModel = function () {
        return TodoModel;
    };
    return TodoCollection;
}(Collection));
__decorate([
    collection
], TodoCollection.prototype, "todos", void 0);

$App = new App().browserBoot();
//app.x = new TodoModel('pe', 'body 1');
//app.y = new TodoModel('alex', 'body 2');
$App["collection"] = new TodoCollection();
$App["collection"].add('pedro!', 'body 1');
$App["collection"].add('javi!', 'body 2');
$App["collection"].add('fran!', 'body 3');
$App["collection"].add('jose!', 'body 4');
$App["collection"].add('javier!', 'body 4');
//# sourceMappingURL=bundle.js.map
