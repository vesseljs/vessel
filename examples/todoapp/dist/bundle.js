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
var Model$$1 = (function () {
    function Model$$1() {
        /**
         * Stores the names of the attributes, so
         * the framework knows about them.
         */
        this.className = this._getClassName();
        this.metadataKey = "__metadata__" + this.className + "__";
        this._createProxy();
    }
    /**
     * Provides a way to set multiple
     * attributes at once.
     *
     * @param attrs
     */
    // TODO - Validation within set
    Model$$1.prototype.set = function (attrs) {
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
    Model$$1.prototype._createProxy = function () {
        if (isArrayEmpty(this.metadataKey))
            throw TypeError("Attempt to create a proxy" +
                " with no metadata.");
        this.attr = new AttribProxy();
        for (var _i = 0, _a = this.metadataKey; _i < _a.length; _i++) {
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
    Model$$1.prototype._validate = function (value, validationFn) {
        return validationFn(value);
    };
    Model$$1.prototype._getClassName = function () {
        return this.constructor.name;
    };
    return Model$$1;
}());

var prefixAttr = 'attr';
var Collection$$1 = (function () {
    function Collection$$1() {
        this.className = this._getClassName();
        this.metadataKey = "__metadata__" + this.className + "__";
    }
    Collection$$1.prototype.add = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var collection = this.getCollection(), Model$$1 = this.getModel();
        try {
            collection.push(new (Model$$1.bind.apply(Model$$1, [void 0].concat(args)))());
        }
        catch (e) {
            if (e instanceof TypeError) {
                if (!isArray(collection)) {
                    console.error("TypeError: The collection '" +
                        this.metadataKey + "' (" + typeof collection +
                        ") must be an array.");
                }
            }
        }
    };
    Collection$$1.prototype.find = function (attrs) {
        return filterOne(this.getCollection(), function (item) {
            return matchPair(item[prefixAttr], attrs);
        });
    };
    Collection$$1.prototype.findAll = function (attrs) {
        return filter(this.getCollection(), function (item) {
            return matchPair(item[prefixAttr], attrs);
        });
    };
    Collection$$1.prototype.pull = function (attrName) {
        return map(this.getCollection(), function (item) {
            return item[prefixAttr][attrName];
        });
    };
    Collection$$1.prototype.sort = function () {
    };
    Collection$$1.prototype.remove = function () {
    };
    Collection$$1.prototype.removeById = function () {
    };
    Collection$$1.prototype.update = function () {
    };
    Collection$$1.prototype.save = function () {
    };
    Collection$$1.prototype.fetch = function () {
    };
    Collection$$1.prototype.willRetrieve = function () {
        return this;
    };
    Collection$$1.prototype.getCollection = function () {
        return this[this[this.metadataKey]];
    };
    Collection$$1.prototype._getClassName = function () {
        return this.constructor.name;
    };
    return Collection$$1;
}());

/**
 * Vessel's Main class.
 *
 * Models, views, collections
 * will inherit this class.
 */

var App$$1 = (function () {
    function App$$1() {
    }
    App$$1.prototype.browserBoot = function () {
        this.detectBrowserFeatures();
        return this;
    };
    App$$1.prototype.detectBrowserFeatures = function () {
        this.can = {
            WeakMap: isSupported(window.WeakMap)
        };
        return this;
    };
    return App$$1;
}());

function isSupported(feature) {
    return typeof feature == 'function';
}
function isArray(arr) {
    return Array.isArray(arr);
}
function isArrayEmpty(arr) {
    if (!arr)
        return true;
    if (arr.length === 0)
        return true;
    return false;
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
    var i, len, keys, item, result;
    if (isArray(obj)) {
        for (i = 0, len = obj.length; i < len; i++) {
            result = fn.call(context, obj[i], i, obj);
        }
    }
    else {
        keys = getKeys(obj);
        for (i = 0, len = keys.length; i < len; i++) {
            item = keys[i];
            result = fn.call(context, item, obj[item], obj);
        }
    }
    return result;
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

// Base
// Services

/**
 * Decorator: @attr
 *
 * Adds the names of the custom attributes to
 * <ModelPrototype>.metadataKEY. This will
 * be used by the framework so it knows what
 * are the model attributes that it will need.
 *
 * Why Metadata Key?
 *
 * Since in javascript/ts decorators are executed
 * at runtime, we cannot access to instances, we
 * will be able to modify the prototype only.
 * That's great until developers extends its
 * classes (for example Model BasketBall extends
 * Model Ball), that said we need classes to have
 * its own metadata key which is accesible by
 * its children but each class will modify only
 * its own metadata key.
 *
 * Symbols and WeakMaps are great, but we need
 * a key variable to store them so the instance can
 * retrieve it later, and we have no access
 * to the instances, so we couldn't assign a different
 * symbol stored in the same variable in the prototype.
 *
 * We don't want private key properties between instances,
 * but between prototypes.
 *
 * @param proto
 * @param attrName
 */
/**
 * Decorator: @attr
 *
 * Adds the names of the custom attributes to
 * <ModelPrototype>.metadataKEY. This will
 * be used by the framework so it knows what
 * are the model attributes that it will need.
 *
 * Why Metadata Key?
 *
 * Since in javascript/ts decorators are executed
 * at runtime, we cannot access to instances, we
 * will be able to modify the prototype only.
 * That's great until developers extends its
 * classes (for example Model BasketBall extends
 * Model Ball), that said we need classes to have
 * its own metadata key which is accesible by
 * its children but each class will modify only
 * its own metadata key.
 *
 * Symbols and WeakMaps are great, but we need
 * a key variable to store them so the instance can
 * retrieve it later, and we have no access
 * to the instances, so we couldn't assign a different
 * symbol stored in the same variable in the prototype.
 *
 * We don't want private key properties between instances,
 * but between prototypes.
 *
 * @param proto
 * @param attrName
 */ function attr(proto, attrName) {
    var className = proto._getClassName(), key = "__metadata__" + className + "__";
    if (!proto.hasOwnProperty(key)) {
        proto[key] = [];
    }
    proto[key].push(attrName);
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
 * <CollectionPrototype>.metadataKEY. This
 * will be used by the framework so it knows
 * what is the collection attribute which
 * will store the models.
 *
 * Why Metadata Key?
 *
 * Since in javascript/ts decorators are executed
 * at runtime, we cannot access to instances, we
 * will be able to modify the prototype only.
 * That's great until developers extends its
 * classes (for example Model BasketBall extends
 * Model Ball), that said we need classes to have
 * its own metadata key which is accesible by
 * its children but each class will modify only
 * its own metadata key.
 *
 * Symbols and WeakMaps are great, but we need
 * a key variable to store them so the instance can
 * retrieve it later, and we have no access
 * to the instances, so we couldn't assign a different
 * symbol stored in the same variable in the prototype.
 *
 * We don't want private key properties between instances,
 * but between prototypes.
 *
 * @param proto
 * @param attrName
 */
/**
 * Decorator: @collection
 *
 * Adds the name of the custom attribute to
 * <CollectionPrototype>.metadataKEY. This
 * will be used by the framework so it knows
 * what is the collection attribute which
 * will store the models.
 *
 * Why Metadata Key?
 *
 * Since in javascript/ts decorators are executed
 * at runtime, we cannot access to instances, we
 * will be able to modify the prototype only.
 * That's great until developers extends its
 * classes (for example Model BasketBall extends
 * Model Ball), that said we need classes to have
 * its own metadata key which is accesible by
 * its children but each class will modify only
 * its own metadata key.
 *
 * Symbols and WeakMaps are great, but we need
 * a key variable to store them so the instance can
 * retrieve it later, and we have no access
 * to the instances, so we couldn't assign a different
 * symbol stored in the same variable in the prototype.
 *
 * We don't want private key properties between instances,
 * but between prototypes.
 *
 * @param proto
 * @param attrName
 */ function collection(proto, attrName) {
    var className = proto._getClassName(), key = "__metadata__" + className + "__";
    if (!proto.hasOwnProperty(key)) {
        proto[key] = '';
    }
    proto[key] = attrName;
}

var TodoModel = (function (_super) {
    __extends(TodoModel, _super);
    function TodoModel(author, body) {
        return _super.call(this) || this;
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
}(Model$$1));
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
}(Collection$$1));
__decorate([
    collection
], TodoCollection.prototype, "todos", void 0);

var TestCollection = (function (_super) {
    __extends(TestCollection, _super);
    function TestCollection() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = [];
        return _this;
    }
    TestCollection.prototype.getModel = function () {
    };
    return TestCollection;
}(Collection$$1));
__decorate([
    collection
], TestCollection.prototype, "data", void 0);

var TestModel = (function (_super) {
    __extends(TestModel, _super);
    function TestModel(name) {
        return _super.call(this, 'test', 'tete') || this;
    }
    return TestModel;
}(TodoModel));
__decorate([
    attr
], TestModel.prototype, "name", void 0);

$App = new App$$1().browserBoot();
/*
$App.register({
    models: {
        'model.todo': TodoModel,
    },
    collections: {
        'collection.todos': TodoCollection
    },
    views: {
    }
});
*/
//app.x = new TodoModel('pe', 'body 1');
//app.y = new TodoModel('alex', 'body 2');
$App["collection"] = new TodoCollection();
$App["collection"].add('pedro!', 'body 1');
$App["collection2"] = new TestCollection();
$App["model"] = new TodoModel('pedro', 'jejejej');
$App["model2"] = new TestModel('nombree');
//# sourceMappingURL=bundle.js.map
