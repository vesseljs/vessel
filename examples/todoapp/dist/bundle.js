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
Metadata.MODEL_IDENTIFIER_KEY = 'identifier';
Metadata.COLLECTION_ATTRIBUTE_KEY = 'collection';
Metadata.DEPENDENCIES_KEY = 'dependencies';

/**
 * class MetadataManager.
 *
 * Provides a way to store/retrieve
 * metadata info. about classes or
 * raw data needed to the packages
 * to work.
 *
 * This class manages the data
 * so it can be set by decorators
 * which are executed at runtime
 * and retrieved later by the
 * instantiated classes. If your
 * package doesn't use decorators
 * your package may not need the
 * MetadataManager.
 *
 * Metadata e.g. Which attributes are
 * being used by the model, what is
 * the name of the attribute in the
 * collection which is the model array
 * or what are the dependencies of a
 * class.
 *
 * Raw Data e.g. Object with paths
 * and routes.
 *
 */
var MetadataManager$$1 = (function () {
    function MetadataManager$$1() {
        /**
         * Metadata container
         * for the loaded classes.
         */
        this.cache = {};
        /**
         * Container for
         * raw data
         */
        this.raw = {};
    }
    /**
     * Setter/getters for
     * built-in decorators.
     */
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
    MetadataManager$$1.prototype.getIdentifier = function (className) {
        return this.retrieve(className, Metadata.MODEL_IDENTIFIER_KEY);
    };
    MetadataManager$$1.prototype.setIdentifier = function (className, attrName) {
        this.loadClass(className)[Metadata.MODEL_IDENTIFIER_KEY] = attrName;
        return this;
    };
    /**
     * Setter for add any kind of metadata,
     * so any dev can use decorators
     * which need metadata without
     * re-coding the core
     */
    MetadataManager$$1.prototype.addMetadata = function (className, key, value) {
        this.loadClass(className)[key] = value;
        return this;
    };
    /**
     * Getter for the setter right above.
     */
    MetadataManager$$1.prototype.getMetadata = function (className, key) {
        return this.retrieve(className, key);
    };
    /**
     * Some packages need to store
     * raw data not associated to any
     * className.
     */
    MetadataManager$$1.prototype.addRawData = function (key, value) {
        this.raw[key] = value;
        return this;
    };
    /**
     * Getter for raw data.
     */
    MetadataManager$$1.prototype.getRawData = function (key) {
        return this.raw[key];
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

/**
 *
 * Limitations:
 *
 * - You can't use a injected property by
 * @get decorator within constructor or a method
 * called immediately within the constructor. But you
 * can always use this.get() or this.container.get()
 * within constructor. That is, because @get decorator
 * adds the dependencies but it doesn't inject them,
 * the dependencies are resolved when the module is
 * started from the container with a .get() or when
 * the module is a dependency of a module which is being
 * started with the container method .get(). That said,
 * using the container method .get() returns the dependency
 * immediately.
 */
var Container$$1 = (function () {
    function Container$$1() {
        this.modules = {};
        this.cache = new WeakMap();
    }
    Container$$1.prototype.register = function (opts) {
        merge(this.modules, opts);
        return this;
    };
    Container$$1.prototype.registerSingleModule = function (name, module) {
        if (!module) {
            throw TypeError("Cannot registerSingleModule(), 'module' was " + module);
        }
        var modules = this.modules;
        if (!modules.hasOwnProperty("@")) {
            modules["@"] = {};
        }
        if (modules["@"].hasOwnProperty(name)) {
            throw TypeError("Cannot registerSingleModule(), '" + name + "' is already registered");
        }
        modules["@"][name] = module;
        return this.loadModule(module);
    };
    /**
     * Gets a given module name.
     */
    Container$$1.prototype.get = function (name) {
        return this.resolveDependencies(name);
    };
    /**
     * Loads a module by its constructor,
     * if it's already instantiated it will
     * return the instance, otherwise it will
     * instantiate and then return it.
     *
     * It can be used to get an instance directly
     * without its name but it will not resolve
     * its @get() dependencies.
     */
    Container$$1.prototype.loadModule = function (constructor) {
        var cache = this.cache;
        if (!cache.has(constructor))
            cache.set(constructor, new constructor());
        return cache.get(constructor);
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
    Container$$1.prototype.getDependencies = function (className) {
        var metadataConstructor = this.modules['@']['@metadata_manager'], metadataManager = this.loadModule(metadataConstructor);
        return metadataManager.getDependencies(className);
    };
    /**
     * Resolves dependencies for a given module, recursively
     * injecting its dependencies.
     */
    Container$$1.prototype.resolveDependencies = function (name) {
        var constructor = this.findModuleByName(name);
        if (!constructor) {
            throw new TypeError("Attempt to get " +
                "non-existent module: '" +
                name + "'. Did you register it?");
        }
        var dependencies = this.getDependencies(constructor.name), topParent = {
            name: name,
            constructor: constructor
        };
        each(dependencies, function (item) {
            this.inject(item.depName, item.attrName, topParent);
        }, this);
        return this.loadModule(constructor);
    };
    /**
     * The purpose of this function is to
     * get a @get('registrated_module_name') injected.
     *
     * All children dependencies are recursively resolved.
     *
     * The top parent of each container.inject() is
     * the very first dependency.
     *
     * e.g. For a @get('module.name') the very first
     * dependency is 'module.name', which will be injected
     * to an instantiated constructor passed in as the
     * 'constructor' parameter.
     *
     * @param depName is the current dependency name.
     * @param attrName is the current attribute name to be injected on.
     * @param topParent is an object with the name and constructor of
     * the topParent dependency (not the module where we are injecting).
     * @param parents is an array with the dependencies for a single @get().
     * @param constructor is where the first dep will be injected.
     *
     */
    Container$$1.prototype.inject = function (depName, attrName, topParent, parents, constructor) {
        if (parents === void 0) { parents = []; }
        if (constructor === void 0) { constructor = null; }
        var depConstructor = this.findModuleByName(depName);
        if (!depConstructor) {
            throw new TypeError("Injection error on '" + topParent.name +
                "': Attempt to inject non-existent dependency: '"
                + depName + "'. Did you register it?");
        }
        if (this.isCircular(depName, parents, topParent.name)) {
            throw new RangeError("Circular dependency detected: " +
                "module injection was impossible. Attempting to " +
                "inject '" + depName + "' which have tried to " +
                "resolve a parent dependency.");
        }
        var depDependencies = this.getDependencies(depConstructor.name);
        parents.push(depName);
        each(depDependencies, function (dep) {
            this.inject(dep.depName, dep.attrName, topParent, parents, depConstructor);
        }, this);
        // Only the top-parent dependency enters here.
        if (parents.length === 1) {
            // Inject the very first parent dependency
            // to the module prototype.
            var topParentInstance = this.loadModule(topParent.constructor), topDependencyInstance = this.loadModule(depConstructor);
            return topParentInstance[attrName] = topDependencyInstance;
        }
        // Children dependencies enter here.
        parents.pop();
        // Inject the dependency to the parent prototype.
        var topDepInstance = this.loadModule(constructor), depInstance = this.loadModule(depConstructor);
        return topDepInstance[attrName] = depInstance;
    };
    /**
     * Find a module by its name, when a
     * match is found, the loop stops.
     *
     * Returns the constructor if a module
     * is found.
     */
    Container$$1.prototype.findModuleByName = function (queryName) {
        var modules = this.modules, keys = getKeys(modules), len = keys.length;
        for (var i = 0; i < len; i++) {
            var moduleType = keys[i], module = modules[moduleType];
            if (module && module.hasOwnProperty(queryName))
                return modules[moduleType][queryName];
        }
        return null;
    };
    Container$$1.prototype.isCircular = function (depName, parents, topParentName) {
        return depName === topParentName || findItem(parents, depName);
    };
    return Container$$1;
}());

/**
 * Loads the injector Container
 * and registers the MetadataManager
 * so the injector is ready to use.
 *
 * It is needed to use decorators which
 * use metadata and to inject dependencies.
 */
var ContainerLoader$$1 = (function () {
    function ContainerLoader$$1() {
        this.boot();
    }
    ContainerLoader$$1.prototype.boot = function () {
        return this.registerTo(new Container$$1());
    };
    ContainerLoader$$1.prototype.registerTo = function (container) {
        container.registerSingleModule('@metadata_manager', MetadataManager$$1);
        return container;
    };
    return ContainerLoader$$1;
}());

var AbstractPackageBoot = (function () {
    function AbstractPackageBoot() {
    }
    return AbstractPackageBoot;
}());

/**
 * Heart of Vessel.
 *
 * Manages the packages, services,
 * injector and configuration.
 */
var Kernel$$1 = (function () {
    function Kernel$$1(app) {
        this.VERSION = '0.0.1-DEV';
        this.app = app;
    }
    Kernel$$1.prototype.boot = function () {
        this.setGlobals()
            .init();
    };
    Kernel$$1.prototype.setGlobals = function () {
        window[this.app.getGlobalName()] = this.app;
        return this;
    };
    Object.defineProperty(Kernel$$1.prototype, "container", {
        get: function () {
            return Vessel$$1.$container;
        },
        enumerable: true,
        configurable: true
    });
    Kernel$$1.prototype.setAppContainer = function (container) {
        this.app.container = container;
        return this;
    };
    Kernel$$1.prototype.registerDependencies = function (container) {
        var registrations = this.app.registerModules();
        container.register(registrations);
        return this;
    };
    Kernel$$1.prototype.bootPackages = function () {
        var bootPackages = this.app.registerPackages();
        return this.loadPackages([bootPackages]);
    };
    Kernel$$1.prototype.loadPackages = function (arr) {
        var namespace = this.app, container = namespace.container;
        each(arr, function (pkgs) {
            each(pkgs, function (pkg) {
                pkg.register(container);
                pkg.setup(namespace, container);
            });
        });
        return this;
    };
    Kernel$$1.prototype.init = function () {
        var container = this.container;
        if (!container) {
            throw new Error("Cannot register dependencies without " +
                "the injector package.");
        }
        this.registerDependencies(container)
            .setAppContainer(container)
            .bootPackages();
        return this;
    };
    return Kernel$$1;
}());

var BaseTypes = (function () {
    function BaseTypes() {
    }
    return BaseTypes;
}());
BaseTypes.VESSEL = 'vessel';
BaseTypes.MODEL = 'model';
BaseTypes.CONTROLLER = 'controller';
BaseTypes.COLLECTION = 'collection';
BaseTypes.VIEW = 'view';
BaseTypes.BRIDGE = 'bridge';
BaseTypes.SERVICE = 'service';

/**
 * Vessel's Main class.
 *
 * Models, views, collections
 * will inherit this class.
 */
var Vessel$$1 = (function () {
    function Vessel$$1() {
        this._type = BaseTypes.VESSEL;
    }
    Object.defineProperty(Vessel$$1.prototype, "container", {
        /**
         * Container: Alias
         *
         * Alias so the instances of Views,
         * Collections, Services, etc. can
         * access container with this.container
         *
         */
        get: function () {
            return Vessel$$1.$container;
        },
        enumerable: true,
        configurable: true
    });
    Vessel$$1.prototype.getClassName = function () {
        return this.constructor.name;
    };
    Vessel$$1.prototype.getType = function () {
        return this._type;
    };
    Vessel$$1.prototype.get = function (module) {
        return this.container.get(module);
    };
    return Vessel$$1;
}());
/**
 * Container
 *
 * Vessel.$container is accessible
 * by decorators executed at runtime
 *
 */
Vessel$$1.$container = new ContainerLoader$$1().boot();

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
        _this._type = BaseTypes.MODEL;
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
    Model$$1.prototype.save = function () {
        var bridge = this.getBridge();
        if (this.isNew()) {
            return bridge.post(this);
        }
        return bridge.put(this);
    };
    Model$$1.prototype.fetch = function () {
        return this.getBridge().get(this);
    };
    Model$$1.prototype.remove = function () {
        return this.getBridge().remove(this);
    };
    Model$$1.prototype.getIdentifier = function () {
        var attrName = this
            .get('@metadata_manager')
            .getIdentifier(this.getClassName());
        return this[attrName];
    };
    Model$$1.prototype.isNew = function () {
        return !this.getIdentifier();
    };
    /**
     * Instances the attribute proxy, it adds each
     * attribute defined in the model with the
     * 'attr' decorator to the proxy.
     * @private
     */
    Model$$1.prototype._createProxy = function () {
        var attrs, metadataManager = this.get('@metadata_manager');
        attrs = metadataManager.getAttributes(this.getClassName());
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
    Model$$1.prototype.getBridge = function () {
        return this.get(this._bridge);
    };
    return Model$$1;
}(Vessel$$1));

var Controller$$1 = (function (_super) {
    __extends(Controller$$1, _super);
    function Controller$$1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._type = BaseTypes.CONTROLLER;
        return _this;
    }
    Controller$$1.prototype.render = function (viewName, renderData) {
        return this.get('@vdom').render(viewName, renderData);
    };
    Controller$$1.prototype.renderRoute = function (routeName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return (_a = this.get('@router')).renderRoute.apply(_a, [routeName].concat(args));
        var _a;
    };
    return Controller$$1;
}(Vessel$$1));

var VirtualNode = (function () {
    function VirtualNode(type) {
        this.children = [];
        this.attributes = {};
        this.element = null;
        this.type = type;
    }
    VirtualNode.prototype.setEl = function (elem) {
        this.element = elem;
        return this;
    };
    VirtualNode.prototype.el = function () {
        return this.element;
    };
    VirtualNode.prototype.set = function (props) {
        merge(this.attributes, props);
        return this;
    };
    VirtualNode.prototype.text = function (str) {
        var children = this.children;
        if (children.length === 0)
            children.push(toString(str));
        return this;
    };
    VirtualNode.prototype.appendTo = function ($parent) {
        $parent.children.push(this);
        return this;
    };
    VirtualNode.prototype.append = function ($child) {
        this.children.push($child);
        return this;
    };
    VirtualNode.prototype.css = function (attrs) {
        var style = '';
        each(attrs, function (attr, value) {
            style += attr + ":" + value + ";";
        });
        return this.set({
            'style': style
        });
    };
    VirtualNode.prototype.link = function (url) {
        return this.set({
            href: url
        });
    };
    VirtualNode.prototype.event = function (name, fn) {
        this.attributes[name] = fn;
        return this;
    };
    VirtualNode.prototype.click = function (fn) {
        return this.set({
            'onclick': fn
        });
    };
    VirtualNode.prototype.dblClick = function (fn) {
        return this.set({
            'ondblclick': fn
        });
    };
    VirtualNode.prototype.change = function (fn) {
        return this.set({
            'onchange': fn
        });
    };
    VirtualNode.prototype.mouseOver = function (fn) {
        return this.set({
            'onmouseover': fn
        });
    };
    VirtualNode.prototype.mouseMove = function (fn) {
        return this.set({
            'onmousemove': fn
        });
    };
    VirtualNode.prototype.mouseOut = function (fn) {
        return this.set({
            'onmouseout': fn
        });
    };
    VirtualNode.prototype.mouseEnter = function (fn) {
        return this.set({
            'onmouseenter': fn
        });
    };
    VirtualNode.prototype.mouseLeave = function (fn) {
        return this.set({
            'onmouseleave': fn
        });
    };
    VirtualNode.prototype.mouseUp = function (fn) {
        return this.set({
            'onmouseup': fn
        });
    };
    VirtualNode.prototype.keyDown = function (fn) {
        return this.set({
            'onkeydown': fn
        });
    };
    VirtualNode.prototype.keyUp = function (fn) {
        return this.set({
            'onkeyup': fn
        });
    };
    VirtualNode.prototype.keyPress = function (fn) {
        return this.set({
            'onkeypress': fn
        });
    };
    VirtualNode.prototype.resize = function (fn) {
        return this.set({
            'onresize': fn
        });
    };
    VirtualNode.prototype.focus = function (fn) {
        return this.set({
            'onfocus': fn
        });
    };
    VirtualNode.prototype.focusIn = function (fn) {
        return this.set({
            'onfocusin': fn
        });
    };
    VirtualNode.prototype.focusOut = function (fn) {
        return this.set({
            'onfocusout': fn
        });
    };
    VirtualNode.prototype.select = function (fn) {
        return this.set({
            'onselect': fn
        });
    };
    VirtualNode.prototype.model = function () {
    };
    return VirtualNode;
}());

var VirtualDOM = (function () {
    function VirtualDOM() {
    }
    VirtualDOM.create = function (type) {
        return new VirtualNode(type);
    };
    VirtualDOM.prototype.render = function (viewName, renderData) {
        var $new, $old, parent, view = Vessel$$1.$container.get(viewName);
        view.setState(renderData);
        $new = view.render();
        $old = view.getLastNode();
        parent = document.querySelector(view.getParent());
        return view.setLastNode(this.updateNode(parent, $new, $old));
    };
    VirtualDOM.prototype.updateNode = function (parent, $newNode, $oldNode, childIndex) {
        if ($oldNode === void 0) { $oldNode = undefined; }
        if (childIndex === void 0) { childIndex = 0; }
        if (!$newNode) {
            this.removeChild(parent, childIndex);
        }
        else if (!$oldNode) {
            this.appendChild(parent, $newNode);
        }
        else if (this.hasChanged($newNode, $oldNode)) {
            this.replaceChild(parent, $newNode, childIndex);
        }
        else if ($newNode.type) {
            var nextParent = parent.childNodes[childIndex], newChildrenLen = $newNode.children.length, oldChildrenLen = $oldNode.children.length, newAttr = $newNode.attributes, oldAttr = $oldNode.attributes;
            for (var attrName in newAttr || oldAttr) {
                this.updateAttribute(nextParent, attrName, newAttr[attrName], oldAttr[attrName]);
            }
            for (var currentChild = 0; currentChild < newChildrenLen || currentChild < oldChildrenLen; currentChild++) {
                var $new = $newNode.children[currentChild], $old = $oldNode.children[currentChild];
                this.updateNode(nextParent, $new, $old, currentChild);
            }
        }
        return $newNode;
    };
    VirtualDOM.prototype.updateAttribute = function (elem, attrName, newValue, oldValue) {
        if (!newValue) {
            this.removeAttribute(elem, attrName, oldValue);
        }
        else if (!oldValue || oldValue !== newValue) {
            this.setAttribute(elem, attrName, newValue);
        }
    };
    VirtualDOM.prototype.createRealElement = function ($node) {
        if (isString($node)) {
            return document.createTextNode($node);
        }
        var $child, elem = document.createElement($node.type), children = $node.children;
        this.setAttributes(elem, $node.attributes);
        if (children) {
            for (var i = 0, len = children.length; i < len; i++) {
                $child = children[i];
                elem.appendChild(this.createRealElement($child));
            }
        }
        $node.setEl(elem);
        return elem;
    };
    VirtualDOM.prototype.hasChanged = function ($node1, $node2) {
        return typeof $node1 !== typeof $node2 ||
            typeof $node1 === Types.STRING && $node1 !== $node2 ||
            $node1.type != $node2.type;
    };
    VirtualDOM.prototype.setAttribute = function (elem, name, value) {
        elem.setAttribute(name, value);
    };
    VirtualDOM.prototype.removeAttribute = function (elem, name, value) {
        elem.removeAttribute(name, value);
    };
    VirtualDOM.prototype.setAttributes = function (elem, attributes) {
        each(attributes, function (name, value) {
            if (isEvent(name)) {
                this.addEvent(elem, name, value);
            }
            else {
                this.setAttribute(elem, name, value);
            }
        }, this);
    };
    VirtualDOM.prototype.addEvent = function (elem, eventName, boundFn) {
        return elem.addEventListener(formatEvent(eventName), boundFn);
    };
    VirtualDOM.prototype.removeChild = function (parent, index) {
        parent.removeChild(parent.childNodes[index]);
    };
    VirtualDOM.prototype.appendChild = function (parent, $newNode) {
        parent.appendChild(this.createRealElement($newNode));
    };
    VirtualDOM.prototype.replaceChild = function (parent, $newNode, index) {
        parent.replaceChild(this.createRealElement($newNode), parent.childNodes[index]);
    };
    return VirtualDOM;
}());

var VirtualDOMBoot = (function (_super) {
    __extends(VirtualDOMBoot, _super);
    function VirtualDOMBoot() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.VERSION = '1.0.0-DEV';
        return _this;
    }
    VirtualDOMBoot.prototype.register = function (container) {
        container.registerSingleModule('@vdom', VirtualDOM);
    };
    VirtualDOMBoot.prototype.setup = function (namespace, container) {
        namespace.router = container.get('@vdom');
    };
    return VirtualDOMBoot;
}(AbstractPackageBoot));

var View$$1 = (function (_super) {
    __extends(View$$1, _super);
    function View$$1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._type = BaseTypes.VIEW;
        _this.state = {};
        return _this;
    }
    View$$1.prototype.setState = function (state) {
        merge(this.state, state);
        return this;
    };
    View$$1.prototype.getLastNode = function () {
        return this.$lastNode;
    };
    View$$1.prototype.setLastNode = function ($node) {
        this.$lastNode = $node;
        return this;
    };
    View$$1.prototype.getParent = function () {
        return this.parent;
    };
    View$$1.prototype.renderRoute = function (routeName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return (_a = this.get('@router')).renderRoute.apply(_a, [routeName].concat(args));
        var _a;
    };
    View$$1.prototype.create = function (nodeType) {
        return VirtualDOM.create(nodeType);
    };
    return View$$1;
}(Vessel$$1));

var prefixAttr = 'attr';
var Collection$$1 = (function (_super) {
    __extends(Collection$$1, _super);
    function Collection$$1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._type = BaseTypes.COLLECTION;
        return _this;
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

var Types = (function () {
    function Types() {
    }
    return Types;
}());
Types.STRING = 'string';
Types.OBJECT = 'object';
Types.FUNCTION = 'function';
Types.NUMBER = 'number';

var RegExp = (function () {
    function RegExp() {
    }
    return RegExp;
}());
RegExp.EVENT_EXP = /^on/;

/**
 * MultipleKeyObject
 *
 * Provides a way to set
 * values with multiple keys.
 *
 */
var MultipleKeyObject$$1 = (function () {
    function MultipleKeyObject$$1() {
        this.container = {};
    }
    MultipleKeyObject$$1.prototype.set = function (keyGroup, value) {
        var masterKey = keyGroup[0];
        for (var i = 0, len = keyGroup.length; i < len; i++) {
            var key = keyGroup[i];
            if (this.has(key)) {
                return this.container[key] = value;
            }
            if (key) {
                defineProp(this.container, key, function getter() {
                    return this["$" + masterKey];
                }, function setter(v) {
                    return this["$" + masterKey] = v;
                });
            }
        }
        return this.container[masterKey] = value;
    };
    MultipleKeyObject$$1.prototype.has = function (key) {
        return this.container.hasOwnProperty(key);
    };
    MultipleKeyObject$$1.prototype.get = function (key) {
        return this.container[key];
    };
    return MultipleKeyObject$$1;
}());

function isSupported(feature) {
    return typeof feature == Types.FUNCTION;
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
function isEvent(exp) {
    return RegExp.EVENT_EXP.test(exp);
}
function isFunction(fn) {
    if (fn == undefined)
        return false;
    if (typeof fn !== Types.FUNCTION)
        return false;
    return true;
}
function isString(exp) {
    return typeof exp === Types.STRING;
}
function isObject(exp) {
    return typeof exp === Types.OBJECT;
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
function findItem(arr, value) {
    return arr.indexOf(value) !== -1;
}
function toString(exp) {
    return exp + "";
}
function formatEvent(eventName) {
    return eventName.slice(2).toLowerCase();
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

// Base
// Services

var Router = (function () {
    function Router() {
    }
    Router.prototype.renderRoute = function (routeName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var controller, route, cachedRoutes, container = Vessel$$1.$container, metadataManager = container.get('@metadata_manager');
        cachedRoutes = metadataManager.getRawData('cached_routes');
        route = cachedRoutes.get(routeName);
        controller = container.loadModule(route.context.constructor);
        if (!route) {
            throw new TypeError("Cannot render non-existent route: '" + routeName + "'.");
        }
        return (_a = route.bound).call.apply(_a, [controller].concat(args));
        var _a;
    };
    return Router;
}());

var RouterBoot = (function (_super) {
    __extends(RouterBoot, _super);
    function RouterBoot() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.VERSION = '1.0.0-DEV';
        return _this;
    }
    RouterBoot.prototype.register = function (container) {
        container.registerSingleModule('@router', Router);
    };
    RouterBoot.prototype.setup = function (namespace, container) {
        namespace.router = container.get('@router');
    };
    return RouterBoot;
}(AbstractPackageBoot));

function route(routeName, routePath) {
    if (routePath === void 0) { routePath = undefined; }
    return function (proto, name, descriptor) {
        var routes, metadataManager = Vessel$$1.$container.get('@metadata_manager');
        routes = metadataManager.getRawData('cached_routes');
        if (!routes) {
            routes = new MultipleKeyObject$$1();
        }
        routes.set([routeName, routePath], {
            routeName: routeName,
            routePath: routePath,
            bound: descriptor.value,
            context: proto
        });
        metadataManager.addRawData('cached_routes', routes);
    };
}

function bootable(constructor) {
    var app = new constructor();
    new Kernel$$1(app).boot();
}

/**
 * Decorator: @get(moduleName)
 *
 * Uses the @metadata_manager service
 *
 *
 * @param depName
 */
function get(depName) {
    return function (proto, attrName) {
        var metadataManager = Vessel$$1.$container.get('@metadata_manager'), className = proto.getClassName();
        metadataManager.setDependency(className, {
            attrName: attrName,
            depName: depName
        });
    };
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
    var metadataManager = Vessel$$1.$container.get('@metadata_manager'), className = proto.getClassName();
    metadataManager.setAttribute(className, attrName);
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
    var metadataManager = Vessel$$1.$container.get('@metadata_manager'), className = proto.getClassName();
    metadataManager.setCollection(className, attrName);
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
    get('collection.test')
], TodoCollection.prototype, "testCollection", void 0);
__decorate([
    get('collection.fifth')
], TodoCollection.prototype, "fifthCollection", void 0);

var ThirdCollection = (function (_super) {
    __extends(ThirdCollection, _super);
    function ThirdCollection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ThirdCollection;
}(Collection$$1));
__decorate([
    get('collection.fourth')
], ThirdCollection.prototype, "fourthCollection", void 0);

var TestCollection = (function (_super) {
    __extends(TestCollection, _super);
    function TestCollection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TestCollection;
}(Collection$$1));
__decorate([
    get('collection.third')
], TestCollection.prototype, "thirdCollection", void 0);

var FourthCollection = (function (_super) {
    __extends(FourthCollection, _super);
    function FourthCollection() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.test = "test";
        return _this;
    }
    return FourthCollection;
}(Collection$$1));

var TodoController = (function (_super) {
    __extends(TodoController, _super);
    function TodoController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TodoController.prototype.indexTodo = function () {
    };
    TodoController.prototype.editTodo = function (id) {
        this.render('view.todo', { id: id });
    };
    TodoController.prototype.createTodo = function () {
    };
    return TodoController;
}(Controller$$1));
__decorate([
    get('collection.todo')
], TodoController.prototype, "collection", void 0);
__decorate([
    route('todo_index', '/')
], TodoController.prototype, "indexTodo", null);
__decorate([
    route('todo_edit', '/edit/{id}')
], TodoController.prototype, "editTodo", null);
__decorate([
    route('todo_create')
], TodoController.prototype, "createTodo", null);

var FifthCollection = (function (_super) {
    __extends(FifthCollection, _super);
    function FifthCollection() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.test = "fifth";
        return _this;
    }
    return FifthCollection;
}(Collection$$1));

var TodoView = (function (_super) {
    __extends(TodoView, _super);
    function TodoView() {
        var _this = _super.call(this) || this;
        _this.parent = '#todo-root';
        _this.onRefresh = _this.onRefresh.bind(_this);
        return _this;
    }
    TodoView.prototype.onRefresh = function () {
        this.renderRoute('todo_edit', ++this.state.id);
    };
    TodoView.prototype.render = function () {
        var div, p, i, button, input, self = this;
        div = this.create('div')
            .set({
            'class': 'todo-class'
        })
            .css({
            'color': 'red'
        });
        p = this.create('p')
            .text("I'm the todo id ")
            .appendTo(div);
        i = this.create('i')
            .text(this.state.id)
            .appendTo(p);
        input = this.create('input')
            .set({
            'id': 'input'
        })
            .appendTo(div);
        button = this.create('button')
            .text("Refresh")
            .click(self.onRefresh)
            .appendTo(div);
        return div;
    };
    return TodoView;
}(View$$1));

var modules = {
    models: {
        'model.todo': TodoModel,
    },
    controllers: {
        'controller.todo': TodoController
    },
    collections: {
        'collection.todo': TodoCollection,
        'collection.test': TestCollection,
        'collection.third': ThirdCollection,
        'collection.fourth': FourthCollection,
        'collection.fifth': FifthCollection
    },
    views: {
        'view.todo': TodoView
    }
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
        return [
            new RouterBoot(),
            new VirtualDOMBoot()
        ];
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
