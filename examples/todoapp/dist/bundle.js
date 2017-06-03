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

var Metadata = (function () {
    function Metadata() {
    }
    return Metadata;
}());
Metadata.MODEL_ATTRIBUTES_KEY = 'attributes';
Metadata.COLLECTION_ATTRIBUTE_KEY = 'collection';
Metadata.DEPENDENCIES_KEY = 'dependencies';

/**
 * class MetadataManager.
 *
 * Provides a way to store/retrieve
 * metadata info. about classes.
 *
 * e.g. Which attributes are being used
 * by the model, what is the name of
 * the attribute in the collection which
 * is the model array or what are the
 * dependencies of a class.
 *
 */
var MetadataManager$$1 = (function () {
    function MetadataManager$$1() {
        /**
         * Metadata container
         * for the loaded classes.
         */
        this.cache = {};
    }
    MetadataManager$$1.prototype.getDependencies = function (className) {
        return this.retrieve(className, Metadata.DEPENDENCIES_KEY);
    };
    MetadataManager$$1.prototype.setDependency = function (className, dep) {
        this.createOrPush(className, Metadata.DEPENDENCIES_KEY, dep);
        return this;
    };
    MetadataManager$$1.prototype.getAttributes = function (className) {
        return this.retrieve(className, Metadata.MODEL_ATTRIBUTES_KEY);
    };
    MetadataManager$$1.prototype.setAttribute = function (className, attrName) {
        this.createOrPush(className, Metadata.MODEL_ATTRIBUTES_KEY, attrName);
        return this;
    };
    MetadataManager$$1.prototype.getCollection = function (className) {
        return this.retrieve(className, Metadata.COLLECTION_ATTRIBUTE_KEY);
    };
    MetadataManager$$1.prototype.setCollection = function (className, attrName) {
        this.loadClass(className)[Metadata.COLLECTION_ATTRIBUTE_KEY] = attrName;
        return this;
    };
    /**
     * Checks if a given
     * className is
     * cached.
     */
    MetadataManager$$1.prototype.has = function (className) {
        return this.cache.hasOwnProperty(className);
    };
    /**
     * Returns the class if it
     * exists or creates and returns
     * it if it doesn't.
     */
    MetadataManager$$1.prototype.loadClass = function (className) {
        if (!this.has(className)) {
            this.cache[className] = {};
        }
        return this.cache[className];
    };
    /**
     * Retrieves the information
     * of metadata if it was
     * set before.
     */
    MetadataManager$$1.prototype.retrieve = function (className, key) {
        if (!this.has(className)) {
            return undefined;
        }
        return this.cache[className][key];
    };
    MetadataManager$$1.prototype.createOrPush = function (className, key, value) {
        var cached = this.loadClass(className);
        if (!cached.hasOwnProperty(key)) {
            cached[key] = [];
        }
        cached[key].push(value);
        return value;
    };
    return MetadataManager$$1;
}());

var Container = (function () {
    function Container() {
        this.modules = {};
        this.cache = new WeakMap();
    }
    Container.prototype.register = function (opts) {
        merge(this.modules, opts);
        return this;
    };
    Container.prototype.registerSingleModule = function (name, module) {
        if (!module) {
            throw TypeError("Cannot registerSingleModule(name, module). 'module' was " + module);
        }
        var modules = this.modules;
        if (!modules.hasOwnProperty("@")) {
            modules["@"] = {};
        }
        modules["@"][name] = module;
        return this;
    };
    /**
     * Gets a given module name.
     */
    Container.prototype.get = function (name) {
        return this.resolveDependencies(name);
    };
    /**
     * Gets the dependencies of a given className.
     *
     * At this time, metadataManager cannot be loaded by
     * container.get(). That is, because the container.get()
     * of the injector needs the MetadataManager to get the
     * dependencies, so we manually load the dependency
     * @metadata_manager (which is already registered
     * within ContainerLoader) avoiding an unkind infinite loop :)
     */
    Container.prototype.getDependencies = function (className) {
        var metadataManager = this.loadDependency('@', '@metadata_manager');
        return metadataManager.getDependencies(className);
    };
    /**
     * Resolves dependencies for a given module, recursively
     * injecting its dependencies.
     */
    Container.prototype.resolveDependencies = function (name) {
        var match = this.findModuleByName(name);
        if (!match) {
            throw new TypeError("Attempt to get " +
                "non-existent module: '" +
                name + "'. Did you register it?");
        }
        var moduleType = match.type, constructor = match.constructor, dependencies = this.getDependencies(constructor.name), topParent = {
            name: name,
            constructor: constructor,
            type: moduleType
        };
        each(dependencies, function (item) {
            this.inject(item.depName, item.attrName, [], null, topParent);
        }, this);
        return this.loadDependency(moduleType, name);
    };
    Container.prototype.inject = function (depName, attrName, parents, constructor, topParent) {
        if (parents === void 0) { parents = []; }
        if (constructor === void 0) { constructor = null; }
        var depType, depDependencies, depConstructor, match = this.findModuleByName(depName);
        if (!match) {
            throw new TypeError("Attempt to inject " +
                "non-existent dependency: '" +
                depName + "'. Did you register it?");
        }
        depType = match.type;
        depConstructor = match.constructor;
        depDependencies = this.getDependencies(depConstructor.name);
        if (this.isCircular(depName, parents, topParent)) {
            throw new RangeError("Circular dependency detected: " +
                "module injection was impossible. Attempting to " +
                "inject '" + depName + "' which have tried to " +
                "resolve a parent dependency.");
        }
        parents.push(depName);
        each(depDependencies, function (item) {
            this.inject(item.depName, item.attrName, parents, depConstructor, topParent);
        }, this);
        // Only the top-parent dependency enters here.
        if (parents.length === 1) {
            // Inject the very first parent dependency
            // to the module prototype.
            var topParentInstance = this.loadDependency(topParent.type, topParent.name), topDependencyInstance = this.loadDependency(depType, depName);
            return topParentInstance[attrName] = topDependencyInstance;
        }
        // Children dependencies enter here.
        parents.pop();
        // Inject the dependency to the parent prototype.
        return constructor.prototype[attrName] = this.loadDependency(depType, depName);
    };
    Container.prototype.loadDependency = function (type, name) {
        var constructor = this.modules[type][name];
        if (type === 'models') {
            throw new TypeError("Attempt to inject as dependency, or get with " +
                "container.get(), the model '" + name + "'. Models cannot be injected as " +
                "they will may be instantiated more than once so dependency injection " +
                "would not make sense. If you are trying to get a model class just " +
                "import it.");
        }
        return this.loadModule(constructor);
    };
    Container.prototype.loadModule = function (constructor) {
        var cache = this.cache;
        if (!cache.has(constructor))
            cache.set(constructor, new constructor());
        return cache.get(constructor);
    };
    Container.prototype.findModuleByName = function (queryName) {
        var i, moduleType, module, modules = this.modules, keys = getKeys(modules), len = keys.length;
        for (i = 0; i < len; i++) {
            moduleType = keys[i];
            module = modules[moduleType];
            if (module && module.hasOwnProperty(queryName))
                return {
                    type: moduleType,
                    name: queryName,
                    constructor: modules[moduleType][queryName]
                };
        }
        return null;
    };
    Container.prototype.isCircular = function (depName, parents, topParent) {
        return depName === topParent.name || findItem(parents, depName);
    };
    return Container;
}());

/**
 * Decorator: @get(moduleName)
 *
 * Uses the @metadata_manager service
 *
 *
 * @param depName
 */
/*
export function get(depName) {
    return function(proto, attrName) {
        let className = proto.getClassName(),
            key = "__dependencies__" + className + "__";
        if (!proto.hasOwnProperty(key)) {
            proto[key] = [];
        }
        proto[key].push({
            attrName: attrName,
            depName: depName
        });
    }
}*/
function get(depName) {
    return function (proto, attrName) {
        var metadataManager = Vessel$$1.prototype.container.get('@metadata_manager'), className = proto.getClassName();
        metadataManager.setDependency(className, {
            attrName: attrName,
            depName: depName
        });
    };
}

// Boot

var ContainerLoader$$1 = (function () {
    function ContainerLoader$$1() {
        this.boot();
    }
    ContainerLoader$$1.prototype.boot = function () {
        return this.registerTo(new Container());
    };
    ContainerLoader$$1.prototype.registerTo = function (container) {
        return container.registerSingleModule('@metadata_manager', MetadataManager$$1);
    };
    return ContainerLoader$$1;
}());

var Kernel$$1 = (function () {
    function Kernel$$1(app) {
        this.app = app;
    }
    Kernel$$1.prototype.boot = function () {
        this.setGlobals();
        this.init();
    };
    Kernel$$1.prototype.setGlobals = function () {
        window[this.app.getGlobalName()] = this.app;
    };
    Kernel$$1.prototype.getContainer = function () {
        return Vessel$$1.prototype.container;
    };
    Kernel$$1.prototype.setAppContainer = function (container) {
        this.app.container = container;
    };
    Kernel$$1.prototype.registerDependencies = function (container) {
        var registrations = this.app.registerModules();
        container.register(registrations);
        return this;
    };
    Kernel$$1.prototype.bootPackages = function () {
        var bootPackages = this.app.registerPackages();
        this.loadPackages([bootPackages]);
    };
    Kernel$$1.prototype.loadPackages = function (arr) {
        each(arr, function (pkgs) {
            each(pkgs, function (pkg) {
                pkg.setup(this.app);
            });
        });
        return this;
    };
    Kernel$$1.prototype.init = function () {
        this.bootPackages();
        var container = this.getContainer();
        if (!container) {
            throw new Error("Cannot register dependencies without " +
                "the injector package.");
        }
        this.registerDependencies(container)
            .setAppContainer(container);
    };
    return Kernel$$1;
}());

/**
 * Vessel's Main class.
 *
 * Models, views, collections
 * will inherit this class.
 */
var Vessel$$1 = (function () {
    function Vessel$$1() {
    }
    Vessel$$1.prototype.getClassName = function () {
        return this.constructor.name;
    };
    Vessel$$1.prototype.get = function (module) {
        return this.container.get(module);
    };
    return Vessel$$1;
}());
Vessel$$1.prototype.container = new ContainerLoader$$1().boot();

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
var Model$$1 = (function (_super) {
    __extends(Model$$1, _super);
    function Model$$1() {
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
    Model$$1.prototype.set = function (attrs) {
        each(attrs, function (attrName, value) {
            var boundFn = this['set' + toInitialUpperCase(attrName)];
            boundFn.call(this, value);
        }, this);
        return this;
    };
    /**
     * Instances the attribute proxy, it adds each
     * attribute defined in the model with the
     * 'attr' decorator to the proxy.
     * @private
     */
    Model$$1.prototype._createProxy = function () {
        var attrs, metadaManager = this.get('@metadata_manager');
        attrs = metadaManager.getAttributes(this.getClassName());
        if (isArrayEmpty(attrs)) {
            throw TypeError("Attempt to create a proxy" +
                " with no metadata.");
        }
        this.attr = new AttribProxy();
        each(attrs, function (attrName) {
            this.attr.addAttribute(attrName);
        }, this);
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
    Model$$1.prototype.save = function () {
    };
    Model$$1.prototype.fetch = function () {
    };
    return Model$$1;
}(Vessel$$1));

var View$$1 = (function (_super) {
    __extends(View$$1, _super);
    function View$$1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return View$$1;
}(Vessel$$1));

var prefixAttr = 'attr';
var Collection$$1 = (function (_super) {
    __extends(Collection$$1, _super);
    function Collection$$1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Collection$$1.prototype.add = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var collection = this.getCollection(), Model$$1 = this.model;
        try {
            collection.push(new (Model$$1.bind.apply(Model$$1, [void 0].concat(args)))());
        }
        catch (e) {
            if (e instanceof TypeError) {
                if (!isArray(collection)) {
                    console.error("TypeError: The collection '" +
                        collection + "' (" + typeof collection +
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
    Collection$$1.prototype.save = function () {
    };
    Collection$$1.prototype.fetch = function () {
    };
    Collection$$1.prototype.willRetrieve = function () {
        return this;
    };
    Collection$$1.prototype.getCollection = function () {
        var name, metadataManager = this.get('@metadata_manager');
        name = metadataManager.getCollection(this.getClassName());
        return this[name];
    };
    return Collection$$1;
}(Vessel$$1));

var BaseApp$$1 = (function () {
    function BaseApp$$1() {
        this.browserBoot();
    }
    BaseApp$$1.prototype.browserBoot = function () {
        this.detectBrowserFeatures();
        return this;
    };
    BaseApp$$1.prototype.detectBrowserFeatures = function () {
        this.can = {
            WeakMap: isSupported(window.WeakMap)
        };
        return this;
    };
    return BaseApp$$1;
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
function findItem(arr, value) {
    return arr.indexOf(value) !== -1;
}
function isFunction(fn) {
    if (fn == undefined)
        return false;
    if (typeof fn !== "function")
        return false;
    return true;
}
function isObject(exp) {
    return typeof exp === "object";
}
function toInitialUpperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
    if (!obj)
        return;
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
function merge(obj, obj2) {
    var prop;
    for (prop in obj2) {
        try {
            obj[prop] = isObject(obj2[prop]) ? merge(obj[prop], obj2[prop]) : obj2[prop];
        }
        catch (e) {
            obj[prop] = obj2[prop];
        }
    }
}

// Base
// Services

function bootable(constructor) {
    var app = new constructor();
    new Kernel$$1(app).boot();
}

/**
 * Decorator: @attr
 *
 * Adds the names of the custom model attributes to
 * the metadata manager.
 *
 * This will be used by the framework so it knows what
 * are the model attributes.
 *
 * @param proto
 * @param attrName
 */
function attr(proto, attrName) {
    var metadataManager = Vessel$$1.prototype.container.get('@metadata_manager'), className = proto.getClassName();
    metadataManager.setAttribute(className, attrName);
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
 * Adds the name of the custom collection attribute to
 * the metadata manager.
 *
 * This will be used by the framework so it knows
 * what is the collection array attribute which
 * will be used to store the models.
 *
 *
 * @param proto
 * @param attrName
 */
function collection(proto, attrName) {
    var metadataManager = Vessel$$1.prototype.container.get('@metadata_manager'), className = proto.getClassName();
    metadataManager.setCollection(className, attrName);
}

var TodoModel = (function (_super) {
    __extends(TodoModel, _super);
    function TodoModel() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    validate(function validateBody(value) {
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
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.todos = [];
        _this.model = TodoModel;
        return _this;
    }
    return TodoCollection;
}(Collection$$1));
__decorate([
    collection
], TodoCollection.prototype, "todos", void 0);
__decorate([
    get('@metadata_manager')
], TodoCollection.prototype, "metadataManager", void 0);

var modules = {
    models: {
        'model.todo': TodoModel,
    },
    collections: {
        'collection.todos': TodoCollection
    },
    views: {}
};

var App = (function (_super) {
    __extends(App, _super);
    function App() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    App.prototype.registerModules = function () {
        return modules;
    };
    App.prototype.registerPackages = function () {
        return [];
    };
    App.prototype.getGlobalName = function () {
        return '$App';
    };
    return App;
}(BaseApp$$1));
App = __decorate([
    bootable
], App);
//# sourceMappingURL=bundle.js.map
