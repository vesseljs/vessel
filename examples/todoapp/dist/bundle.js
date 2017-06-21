/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}





function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}





function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
    MetadataManager$$1.prototype.setConfig = function (cfgObj) {
        return this.addRawData('app_config', cfgObj);
    };
    MetadataManager$$1.prototype.getConfig = function (configName) {
        if (configName === void 0) { configName = undefined; }
        return this.getRawData('app_config')[configName] ||
            this.getRawData('app_config');
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
        merge$$1(this.modules, opts);
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
    Container$$1.prototype.remove = function (constructor) {
        return this.cache.delete(constructor);
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
        each$$1(dependencies, function (item) {
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
        each$$1(depDependencies, function (dep) {
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
        var modules = this.modules, keys = getKeys$$1(modules), len = keys.length;
        for (var i = 0; i < len; i++) {
            var moduleType = keys[i], module = modules[moduleType];
            if (module && module.hasOwnProperty(queryName))
                return modules[moduleType][queryName];
        }
        return null;
    };
    Container$$1.prototype.isCircular = function (depName, parents, topParentName) {
        return depName === topParentName || findItem$$1(parents, depName);
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
        this.VERSION = '1.0.0-PRE';
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
        each$$1(arr, function (pkgs) {
            each$$1(pkgs, function (pkg) {
                pkg.register(container);
                pkg.setup(namespace, container);
            });
        });
        return this;
    };
    Kernel$$1.prototype.registerAppConfig = function () {
        var config = this.app.registerConfig();
        return this.container.get('@metadata_manager')
            .setConfig(config);
    };
    Kernel$$1.prototype.init = function () {
        var container = this.container;
        if (!container) {
            throw new Error("Cannot register dependencies without " +
                "the injector package.");
        }
        this.registerDependencies(container)
            .setAppContainer(container)
            .bootPackages()
            .registerAppConfig();
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
BaseTypes.SERVICE = 'service';
BaseTypes.REMOTE_SERVICE = 'remote_service';
BaseTypes.BRIDGE = 'bridge';
BaseTypes.HTTP_BRIDGE = 'http_bridge';
BaseTypes.STORAGE_BRIDGE = 'storage_bridge';

var Types = (function () {
    function Types() {
    }
    return Types;
}());
Types.STRING = 'string';
Types.OBJECT = 'object';
Types.FUNCTION = 'function';
Types.NUMBER = 'number';

/**
 * Vessel's Main class.
 *
 * Base classes will inherit
 * this class.
 */
var Vessel$$1 = (function () {
    function Vessel$$1() {
        this._type = BaseTypes.VESSEL;
    }
    Vessel$$1.detectBrowserFeatures = function () {
        return {
            WeakMap: isSupported$$1(window.WeakMap),
            pushState: isSupported$$1(window.history)
                && isSupported$$1(window.history.pushState),
            onhashchange: "onhashchange" in window
        };
    };
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
Vessel$$1.can = Vessel$$1.detectBrowserFeatures();

var Service$$1 = (function (_super) {
    __extends(Service$$1, _super);
    function Service$$1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._type = BaseTypes.SERVICE;
        return _this;
    }
    return Service$$1;
}(Vessel$$1));

var HttpMethods = (function () {
    function HttpMethods() {
    }
    return HttpMethods;
}());
HttpMethods.GET = 'GET';
HttpMethods.POST = 'POST';
HttpMethods.PUT = 'PUT';
HttpMethods.DELETE = 'DELETE';

var RemoteService$$1 = (function (_super) {
    __extends(RemoteService$$1, _super);
    function RemoteService$$1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._type = BaseTypes.REMOTE_SERVICE;
        return _this;
    }
    RemoteService$$1.prototype.getRemoteUrl = function () {
        return this.get('@metadata_manager')
            .getConfig('remoteUrl');
    };
    RemoteService$$1.prototype.newAjaxRequest = function (request) {
        var url = request.fullUrl, method = request.getMethod(), headers = request.getHeaders(), params = request.getParameters(), body = request.getBody();
        return new Promise(function (resolve, reject) {
            var xhttp = new XMLHttpRequest();
            xhttp.onload = function () {
                if (xhttp.status === 200) {
                    resolve(xhttp.response);
                }
                else {
                    reject(xhttp.statusText);
                }
            };
            xhttp.onerror = function () {
                reject("Network error.");
            };
            xhttp.open(method, url);
            each$$1(headers, function (header, value) {
                xhttp.setRequestHeader(header, value);
            });
            if (isGet$$1(method)) {
                xhttp.send();
            }
            else {
                var payload = isEmpty$$1(body) ? params : JSON.stringify(body);
                if (!payload) {
                    throw new TypeError("newAjaxRequest: Attempt to send a post request " +
                        "with no parameters nor body within the request");
                }
                xhttp.send(payload);
            }
        });
    };
    RemoteService$$1.prototype.getRequest = function (request) {
        return this.newAjaxRequest(this.setMethod(request, HttpMethods.GET));
    };
    RemoteService$$1.prototype.postRequest = function (request) {
        return this.newAjaxRequest(this.setMethod(request, HttpMethods.POST));
    };
    RemoteService$$1.prototype.putRequest = function (request) {
        return this.newAjaxRequest(this.setMethod(request, HttpMethods.PUT));
    };
    RemoteService$$1.prototype.removeRequest = function (request) {
        return this.newAjaxRequest(this.setMethod(request, HttpMethods.DELETE));
    };
    RemoteService$$1.prototype.setMethod = function (request, method) {
        if (!request.getMethod()) {
            request.setMethod(method);
        }
        return request;
    };
    return RemoteService$$1;
}(Service$$1));

var Bridge$$1 = (function (_super) {
    __extends(Bridge$$1, _super);
    function Bridge$$1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._type = BaseTypes.BRIDGE;
        return _this;
    }
    return Bridge$$1;
}(RemoteService$$1));

var Request = (function () {
    function Request(opts) {
        if (opts === void 0) { opts = null; }
        this.url = '';
        this.method = '';
        this.headers = {};
        this.body = null;
        this.parameters = '';
        if (opts) {
            this.setDefaults(opts);
        }
    }
    Object.defineProperty(Request.prototype, "fullUrl", {
        get: function () {
            return this.url + this.parameters;
        },
        enumerable: true,
        configurable: true
    });
    Request.prototype.setUrl = function (url) {
        this.url = url;
        return this;
    };
    Request.prototype.getUrl = function () {
        return this.url;
    };
    Request.prototype.setBody = function (body) {
        this.body = body;
        return this;
    };
    Request.prototype.getBody = function () {
        return this.body;
    };
    Request.prototype.setHeaders = function (headers) {
        this.headers = headers;
        return this;
    };
    Request.prototype.getHeaders = function () {
        return this.headers;
    };
    Request.prototype.setParameters = function (parameters) {
        var result = '?';
        each$$1(parameters, function (param, value) {
            result += param + '=' + value + '&';
        }, this);
        this.parameters = result.replace(RegExpressions.LAST_AMPERSAND, '');
        return this;
    };
    Request.prototype.getParameters = function () {
        return this.parameters;
    };
    Request.prototype.setMethod = function (method) {
        this.method = method;
        return this;
    };
    Request.prototype.getMethod = function () {
        return this.method;
    };
    Request.prototype.setDefaults = function (opts) {
        var setter;
        each$$1(opts, function (opt, value) {
            if (!this.hasOwnProperty(opt)) {
                throw new TypeError("Request: parameter error, option " + opt + " does " +
                    "not exist.");
            }
            setter = this["set" + toInitialUpperCase$$1(opt)];
            setter.call(this, value);
        }, this);
        return this;
    };
    return Request;
}());

var HttpBridge$$1 = (function (_super) {
    __extends(HttpBridge$$1, _super);
    function HttpBridge$$1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._type = BaseTypes.HTTP_BRIDGE;
        return _this;
    }
    HttpBridge$$1.prototype.createRequest = function (obj, requestCustomOptions) {
        if (requestCustomOptions === void 0) { requestCustomOptions = null; }
        var requestOptions = this.buildJSONRequest(obj, requestCustomOptions);
        // If it's POST (create) we don't
        // want the {id} to be added to
        // the url.
        //
        // E.g.:    /todos/{id} -> /todos
        if (!requestOptions.hasOwnProperty('url')) {
            requestOptions.url = this.getPartialUrl();
        }
        return this.bridgeRequest(obj, this.postRequest, this.create, requestOptions);
    };
    HttpBridge$$1.prototype.readRequest = function (obj, requestCustomOptions) {
        if (requestCustomOptions === void 0) { requestCustomOptions = null; }
        return this.bridgeRequest(obj, this.getRequest, this.read, requestCustomOptions);
    };
    HttpBridge$$1.prototype.updateRequest = function (obj, requestCustomOptions) {
        if (requestCustomOptions === void 0) { requestCustomOptions = null; }
        var requestOptions = this.buildJSONRequest(obj, requestCustomOptions);
        return this.bridgeRequest(obj, this.putRequest, this.update, requestOptions);
    };
    HttpBridge$$1.prototype.destroyRequest = function (obj, requestCustomOptions) {
        if (requestCustomOptions === void 0) { requestCustomOptions = null; }
        var requestOptions = this.buildJSONRequest(obj, requestCustomOptions);
        return this.bridgeRequest(obj, this.removeRequest, this.destroy, requestOptions);
    };
    HttpBridge$$1.prototype.getPartialUrl = function () {
        return this.getRemoteUrl() + this.endPoint;
    };
    HttpBridge$$1.prototype.getObjUrl = function (obj) {
        if (isModel$$1(obj)) {
            return this.getPartialUrl() + '/' + this.extractIdentifier(obj);
        }
        else if (isCollection$$1(obj)) {
            return this.getPartialUrl();
        }
    };
    // isModel Alias
    HttpBridge$$1.prototype.isModel = function (obj) {
        return isModel$$1(obj);
    };
    // isCollection Alias
    HttpBridge$$1.prototype.isCollection = function (obj) {
        return isCollection$$1(obj);
    };
    HttpBridge$$1.prototype.buildJSONRequest = function (obj, requestCustomOptions) {
        var requestOptions = {
            body: obj.getAttrs(),
            headers: {
                'Content-type': 'application/json'
            }
        };
        return merge$$1(requestOptions, requestCustomOptions);
    };
    HttpBridge$$1.prototype.extractIdentifier = function (obj) {
        var id = obj.getIdentifier();
        if (!this.isValidIdentifier(id)) {
            throw new TypeError("Bridge: Invalid identifier '" +
                id + "' (" + typeof id + ").");
        }
        return id;
    };
    HttpBridge$$1.prototype.isValidIdentifier = function (exp) {
        return typeof exp === Types.STRING && exp !== "" ||
            typeof exp === Types.NUMBER;
    };
    HttpBridge$$1.prototype.bridgeRequest = function (obj, requestCb, processCb, requestOptions) {
        var self = this, request, processedData, requestPromise, data;
        request = new Request();
        request.setDefaults(requestOptions);
        if (!requestOptions.hasOwnProperty('url')) {
            request.setUrl(this.getObjUrl(obj));
        }
        return new Promise(function (resolve, reject) {
            requestPromise = requestCb.call(self, request);
            requestPromise.then(function onSuccess(response) {
                data = self.getResponse(response);
                processedData = processCb.call(self, data, obj);
                resolve(processedData);
            }, function onError(response) {
                reject(response);
            });
        });
    };
    return HttpBridge$$1;
}(Bridge$$1));

var StorageBridge$$1 = (function (_super) {
    __extends(StorageBridge$$1, _super);
    function StorageBridge$$1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._type = BaseTypes.STORAGE_BRIDGE;
        return _this;
    }
    return StorageBridge$$1;
}(Bridge$$1));

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
        defineProp$$1(this, name, function getter() {
            return this.data[name];
        }, function setter(value) {
            this.data[name] = value;
        });
    };
    AttribProxy.prototype.getAttrs = function () {
        return this.data;
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
        each$$1(attrs, function (attrName, value) {
            var boundFn = this['set' + toInitialUpperCase$$1(attrName)];
            boundFn.call(this, value);
        }, this);
        return this;
    };
    Model$$1.prototype.save = function (requestOptions) {
        if (requestOptions === void 0) { requestOptions = null; }
        var bridge = this.getBridge();
        if (this.isNew()) {
            return bridge.createRequest(this, requestOptions);
        }
        return bridge.updateRequest(this, requestOptions);
    };
    Model$$1.prototype.fetch = function (requestOptions) {
        if (requestOptions === void 0) { requestOptions = null; }
        return this.getBridge().readRequest(this, requestOptions = null);
    };
    Model$$1.prototype.remove = function (requestOptions) {
        if (requestOptions === void 0) { requestOptions = null; }
        return this.getBridge().destroyRequest(this, requestOptions = null);
    };
    Model$$1.prototype.getIdentifier = function () {
        var attrName = this
            .get('@metadata_manager')
            .getIdentifier(this.getClassName());
        return this.attr[attrName];
    };
    Model$$1.prototype.getAttrs = function () {
        return this.attr.getAttrs();
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
        if (isArrayEmpty$$1(attrs)) {
            throw TypeError("Attempt to create a proxy" +
                " with no metadata.");
        }
        this.attr = new AttribProxy();
        each$$1(attrs, function (attrName) {
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
        var bridge = this.bridge;
        if (!bridge) {
            throw new TypeError("Bridge does not exist. Define a bridge " +
                "for " + this.getClassName());
        }
        return this.get(bridge);
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
    Controller$$1.prototype.unrender = function (viewName) {
        return this.get('@vdom').unrender(viewName);
    };
    Controller$$1.prototype.route = function (routeName, routeParams) {
        return this.get('@router').route(routeName, routeParams);
    };
    Controller$$1.prototype.routeExec = function (routeName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return this.get('@router').route(routeName, args);
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
    VirtualNode.prototype.index = function () {
        // Internet explorer 6,7,8 will include
        // comment nodes.
        // https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/children#Browser_compatibility
        //
        var el = this.el();
        return Array.prototype.indexOf.call(el.parentElement.children, el);
    };
    VirtualNode.prototype.set = function (props) {
        merge$$1(this.attributes, props);
        return this;
    };
    VirtualNode.prototype.text = function (str) {
        var children = this.children;
        if (children.length === 0)
            children.push(toString$$1(str));
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
        each$$1(attrs, function (attr, value) {
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
        parent = view.getParentElement();
        return view.setLastNode(this.updateNode(parent, $new, $old));
    };
    VirtualDOM.prototype.unrender = function (viewName) {
        var view, container = Vessel$$1.$container;
        view = container.get(viewName);
        this.removeChild(view.getParentElement(), view.getLastNode().index());
        return Vessel$$1.$container.remove(view);
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
        if (isString$$1($node)) {
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
        each$$1(attributes, function (name, value) {
            if (isEvent$$1(name)) {
                this.addEvent(elem, name, value);
            }
            else {
                this.setAttribute(elem, name, value);
            }
        }, this);
    };
    VirtualDOM.prototype.addEvent = function (elem, eventName, boundFn) {
        return elem.addEventListener(formatEvent$$1(eventName), boundFn);
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
        merge$$1(this.state, state);
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
    View$$1.prototype.getParentElement = function () {
        return document.querySelector(this.getParent());
    };
    View$$1.prototype.route = function (routeName, routeParams) {
        return this.get('@router').route(routeName, routeParams);
    };
    View$$1.prototype.routeExec = function (routeName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return this.get('@router').routeExec(routeName, args);
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
                if (!isArray$$1(collection)) {
                    console.error("TypeError: The collection '" +
                        collection + "' (" + typeof collection +
                        ") must be an array.");
                }
            }
        }
    };
    Collection$$1.prototype.create = function () {
    };
    Collection$$1.prototype.fetch = function (requestOptions) {
        if (requestOptions === void 0) { requestOptions = null; }
        return this.getBridge().readRequest(this, requestOptions);
    };
    Collection$$1.prototype.find = function (attrs) {
        return filterOne$$1(this.getCollection(), function (item) {
            return matchPair$$1(item[prefixAttr], attrs);
        });
    };
    Collection$$1.prototype.findAll = function (attrs) {
        return filter$$1(this.getCollection(), function (item) {
            return matchPair$$1(item[prefixAttr], attrs);
        });
    };
    Collection$$1.prototype.pull = function (attrName) {
        return map$$1(this.getCollection(), function (item) {
            return item[prefixAttr][attrName];
        });
    };
    Collection$$1.prototype.sort = function () {
    };
    Collection$$1.prototype.remove = function () {
    };
    Collection$$1.prototype.removeById = function () {
    };
    Collection$$1.prototype.willRetrieve = function () {
        return this;
    };
    Collection$$1.prototype.getCollection = function () {
        var name, metadataManager = this.get('@metadata_manager');
        name = metadataManager.getCollection(this.getClassName());
        return this[name];
    };
    Collection$$1.prototype.getBridge = function () {
        var bridge = this.bridge;
        if (!bridge) {
            throw new TypeError("Bridge does not exist. Define a bridge " +
                "for " + this.getClassName());
        }
        return this.get(bridge);
    };
    return Collection$$1;
}(Vessel$$1));

var BaseApp = (function () {
    function BaseApp() {
    }
    return BaseApp;
}());

var RegExpressions = (function () {
    function RegExpressions() {
    }
    return RegExpressions;
}());
RegExpressions.EVENT_EXP = /^on/i;
RegExpressions.LAST_AMPERSAND = /\&$/;
RegExpressions.LAST_URL_SLASH = /\/+$/;
RegExpressions.ROUTE_PATH_PARAMETER = /(:)(\w+)/g;
RegExpressions.GET_PARAMETER = /\?([\w\&\=]*)/;

function isSupported$$1(feature) {
    return typeof feature === Types.FUNCTION ||
        typeof feature === Types.OBJECT;
}
function isArray$$1(arr) {
    return Array.isArray(arr);
}
function isEmpty$$1(obj) {
    if (obj == null)
        return true;
    return getKeys$$1(obj).length === 0;
}
function isArrayEmpty$$1(arr) {
    if (!arr)
        return true;
    if (arr.length === 0)
        return true;
    return false;
}
function isEvent$$1(exp) {
    return RegExpressions.EVENT_EXP.test(exp);
}
function isFunction$$1(fn) {
    if (fn == undefined)
        return false;
    if (typeof fn !== Types.FUNCTION)
        return false;
    return true;
}
function isString$$1(exp) {
    return typeof exp === Types.STRING;
}
function isObject$$1(exp) {
    return typeof exp === Types.OBJECT;
}
function isGet$$1(method) {
    return method === HttpMethods.GET;
}
function isModel$$1(obj) {
    return obj.getType() === BaseTypes.MODEL;
}
function isCollection$$1(obj) {
    return obj.getType() === BaseTypes.COLLECTION;
}
function each$$1(obj, fn, context) {
    if (context === void 0) { context = null; }
    var i, len, keys, item, result;
    if (!obj)
        return;
    if (isArray$$1(obj)) {
        for (i = 0, len = obj.length; i < len; i++) {
            result = fn.call(context, obj[i], i, obj);
        }
    }
    else {
        keys = getKeys$$1(obj);
        for (i = 0, len = keys.length; i < len; i++) {
            item = keys[i];
            result = fn.call(context, item, obj[item], obj);
        }
    }
    return result;
}
function matchPair$$1(obj, attrs) {
    var keys = getKeys$$1(attrs), len = keys.length, key, i;
    for (i = 0; i < len; i++) {
        key = keys[i];
        if (attrs[key] !== obj[key] || !(key in obj))
            return false;
    }
    return true;
}
function map$$1(arr, fn, context) {
    if (context === void 0) { context = null; }
    var newArr = [], result;
    each$$1(arr, function (item, index) {
        result = fn.call(context, item, index);
        if (result)
            newArr.push(result);
    });
    return newArr;
}
function filter$$1(obj, fn, context) {
    if (context === void 0) { context = null; }
    var matches = [];
    each$$1(obj, function (item, index) {
        if (fn.call(context, item, index, obj))
            matches.push(item);
    });
    return matches;
}
function filterOne$$1(arr, fn, context) {
    if (context === void 0) { context = null; }
    var i, item, len = arr.length;
    for (i = 0; i < len; i++) {
        if (fn.call(context, item = arr[i], i, arr))
            return item;
    }
    return false;
}
function merge$$1(obj, obj2) {
    var prop;
    for (prop in obj2) {
        try {
            obj[prop] = isObject$$1(obj2[prop]) ? merge$$1(obj[prop], obj2[prop]) : obj2[prop];
        }
        catch (e) {
            obj[prop] = obj2[prop];
        }
    }
    return obj;
}
function findItem$$1(arr, value) {
    return arr.indexOf(value) !== -1;
}
function toString$$1(exp) {
    return exp + "";
}
function formatEvent$$1(eventName) {
    return eventName.slice(2).toLowerCase();
}
function removeLastSlash$$1(url) {
    return url.replace(RegExpressions.LAST_URL_SLASH, url);
}
function toInitialUpperCase$$1(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function toRegExpPath$$1(pathStr) {
    return new RegExp('^' + pathStr.replace(RegExpressions.ROUTE_PATH_PARAMETER, "([^\/]+)") + '$');
}
function defineProp$$1(obj, prop, getter, setter) {
    var descriptor = {
        enumerable: false,
        configurable: true,
        set: setter,
        get: getter
    };
    Object.defineProperty(obj, prop, descriptor);
}
function getKeys$$1(obj) {
    return Object.keys(obj);
}
function getCurrentUrl$$1() {
    return window.location.href;
}

// Base

// Services

var Strategy = (function () {
    function Strategy(strategy) {
        this.currentStrategy = strategy;
    }
    Strategy.prototype.getStrategy = function () {
        return this.currentStrategy;
    };
    Strategy.prototype.setStrategy = function (strategy) {
        this.currentStrategy = strategy;
        return this;
    };
    Strategy.prototype.isHistory = function () {
        return this.getStrategy() === Strategy.HistoryStrategy;
    };
    Strategy.prototype.isHash = function () {
        return this.getStrategy() === Strategy.HashStrategy;
    };
    return Strategy;
}());
Strategy.HashStrategy = 'hash';
Strategy.HistoryStrategy = 'history';

var Fragment = (function () {
    function Fragment(url) {
        if (url === void 0) { url = undefined; }
        this.router = this.container.get('@router');
        if (url) {
            this.setUrl(url);
        }
        else {
            this.findOutUrl();
        }
    }
    Fragment.prototype.findOutUrl = function () {
        return this.setUrl(getCurrentUrl$$1().replace(this.router.getBaseUrl(), ''));
    };
    Object.defineProperty(Fragment.prototype, "container", {
        get: function () {
            return Vessel$$1.$container;
        },
        enumerable: true,
        configurable: true
    });
    Fragment.prototype.getUrl = function () {
        return this.url;
    };
    Fragment.prototype.setUrl = function (url) {
        this.url = removeLastSlash$$1(url);
        return this;
    };
    Fragment.prototype.resolve = function () {
        var route = this.matchRoute();
        // 404. Not Route Found
        if (!route)
            return false;
        Router.onRouteFound(route, this.getParams(route));
    };
    Fragment.prototype.matchRoute = function () {
        var routes = this.router.getAllRoutes(), routeNames = getKeys$$1(routes);
        for (var i = 0, len = routeNames.length; i < len; i++) {
            var routeName = routeNames[i], routeObj = routes[routeName];
            if (routeObj.getRegExpPath().test(this.getUrl()))
                return routeObj;
        }
        return false;
    };
    Fragment.prototype.getParams = function (route) {
        return route.getRegExpPath().exec(this.getUrl()).slice(1);
    };
    return Fragment;
}());

var Router = (function () {
    function Router() {
        this.strategy = new Strategy(Strategy.HistoryStrategy);
    }
    Router.prototype.boot = function () {
        this.listen();
    };
    Router.prototype.setStrategy = function (strategy) {
        this.strategy = strategy;
        return this;
    };
    Router.prototype.getStrategy = function () {
        return this.strategy;
    };
    Router.prototype.routeExec = function (routeName, args) {
        var route = this.getRouteByName(routeName);
        Router.onRouteFound(route, args);
    };
    Router.prototype.route = function (routeName, routeParamsObj) {
        if (routeParamsObj === void 0) { routeParamsObj = null; }
        var generatedPath, route = this.getRouteByName(routeName);
        each$$1(routeParamsObj, function (param, value) {
            route.setParameter(param, value);
        });
        generatedPath = route.getResult();
        this.push(generatedPath);
        return new Fragment(generatedPath).resolve();
    };
    Router.prototype.push = function (path) {
        var url = path ? this.getBaseUrl() + path : this.getBaseUrl();
        window.history.pushState({}, '', url);
    };
    Router.prototype.listen = function () {
        if (this.getStrategy().isHistory() && Vessel$$1.can.pushState) {
            window.addEventListener('popstate', Router.onRouteChange);
        }
        else if (this.getStrategy().isHash() && Vessel$$1.can.onhashchange) {
            window.addEventListener('hashchange', Router.onRouteChange);
            // fallback
        }
        else {
        }
    };
    Router.prototype.getRouteByName = function (name) {
        return this.getAllRoutes()[name];
    };
    Router.prototype.getAllRoutes = function () {
        return Vessel$$1.$container
            .get('@metadata_manager')
            .getRawData('cached_routes');
    };
    Router.prototype.getBaseUrl = function () {
        return removeLastSlash$$1(Vessel$$1.$container
            .get('@metadata_manager')
            .getConfig('baseUrl'));
    };
    Router.onRouteChange = function () {
        return new Fragment().resolve();
    };
    Router.onRouteFound = function (route, fragmentArgs) {
        var controller = Vessel$$1.$container.loadModule(route.getContext().constructor);
        return route.getBound().apply(controller, fragmentArgs);
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
        namespace.router = container.get('@router').boot();
    };
    return RouterBoot;
}(AbstractPackageBoot));

var Route = (function () {
    function Route(name) {
        this.name = name;
    }
    Route.prototype.setParameter = function (param, value) {
        var path = this.generatedPath
            ? this.generatedPath
            : this.path;
        return this.generatedPath = path.replace(':' + param, value);
    };
    Route.prototype.getResult = function () {
        var generated = this.generatedPath;
        this.generatedPath = void 0;
        return generated;
    };
    Route.prototype.getName = function () {
        return this.name;
    };
    Route.prototype.getPath = function () {
        return this.path;
    };
    Route.prototype.setPath = function (path) {
        this.path = path;
        return this;
    };
    Route.prototype.getRegExpPath = function () {
        return this.pathExp;
    };
    Route.prototype.setRegExpPath = function (pathExp) {
        this.pathExp = pathExp;
        return this;
    };
    Route.prototype.getBound = function () {
        return this.bound;
    };
    Route.prototype.setBound = function (bound) {
        this.bound = bound;
        return this;
    };
    Route.prototype.getContext = function () {
        return this.context;
    };
    Route.prototype.setContext = function (context) {
        this.context = context;
        return this;
    };
    return Route;
}());

function route(routeName, routePath) {
    if (routePath === void 0) { routePath = undefined; }
    return function (proto, name, descriptor) {
        var route, metadataManager = Vessel$$1.$container.get('@metadata_manager'), routes = metadataManager.getRawData('cached_routes');
        if (isEmpty$$1(routes))
            routes = {};
        route = new Route(routeName);
        if (routePath) {
            route.setPath(routePath)
                .setRegExpPath(toRegExpPath$$1(routePath));
        }
        route.setBound(descriptor.value)
            .setContext(proto);
        routes[routeName] = route;
        metadataManager.addRawData('cached_routes', routes);
    };
}

var app = {
    // Application URL
    baseUrl: 'http://localhost:3000',
    // Remote Rest API Server URL
    remoteUrl: 'https://httpbin.org'
};

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
 * Decorator: @attr
 *
 * Adds the name of the identifier attribute to
 * the metadata manager.
 *
 * This will be used by the framework so it knows what
 * are the model identifier.
 *
 * @param proto
 * @param attrName
 */
function identifier(proto, attrName) {
    var metadataManager = Vessel$$1.$container.get('@metadata_manager'), className = proto.getClassName();
    metadataManager.setIdentifier(className, attrName);
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
        if (!isFunction$$1(validationFn)) {
            throw TypeError("The @validate() decorator, " +
                "applied to '" + setterName + "()', requires a " +
                "valid validator function as parameter to be " +
                "passed in.");
        }
        var boundFn = descriptor.value;
        descriptor.value = function setAttribute(value) {
            if (this._validate(value, validationFn)) {
                return boundFn.call(this, value);
            }
        };
        return descriptor;
    };
}

var TodoController = (function (_super) {
    __extends(TodoController, _super);
    function TodoController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TodoController.prototype.indexTodo = function () {
        this.unrender('view.todo');
    };
    TodoController.prototype.editTodo = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.render('view.todo', { id: id });
                return [2 /*return*/];
            });
        });
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
    route('todo_edit', '/edit/:id')
], TodoController.prototype, "editTodo", null);
__decorate([
    route('todo_create')
], TodoController.prototype, "createTodo", null);

var TodoModel = (function (_super) {
    __extends(TodoModel, _super);
    function TodoModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bridge = 'service.todo';
        return _this;
    }
    TodoModel.prototype.getId = function () {
        return this.attr.id;
    };
    TodoModel.prototype.setId = function (value) {
        this.attr.id = value;
        return this;
    };
    TodoModel.prototype.getAuthor = function () {
        return this.attr.author;
    };
    TodoModel.prototype.setAuthor = function (value) {
        this.attr.author = value;
        return this;
    };
    TodoModel.prototype.getBody = function () {
        return this.attr.body;
    };
    TodoModel.prototype.setBody = function (value) {
        this.attr.body = value;
        return this;
    };
    return TodoModel;
}(Model$$1));
__decorate([
    identifier,
    attr
], TodoModel.prototype, "id", void 0);
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
        _this.bridge = 'service.todo';
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
        this.route('todo_edit', { id: ++this.state.id });
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

var TodoService = (function (_super) {
    __extends(TodoService, _super);
    function TodoService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.endPoint = '/post';
        return _this;
    }
    TodoService.prototype.getResponse = function (response) {
        return JSON.parse(response);
    };
    TodoService.prototype.create = function (jsonResponse, model) {
        model.setId(jsonResponse.id);
        return model;
    };
    TodoService.prototype.read = function (jsonResponse, obj) {
        return jsonResponse;
    };
    TodoService.prototype.update = function (jsonResponse, model) {
        return model;
    };
    TodoService.prototype.destroy = function (jsonResponse) {
        return jsonResponse.id;
    };
    return TodoService;
}(HttpBridge$$1));

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
    },
    services: {
        'service.todo': TodoService
    }
};

var App = (function (_super) {
    __extends(App, _super);
    function App() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    App.prototype.registerConfig = function () {
        return app;
    };
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
}(BaseApp));
App = __decorate([
    bootable
], App);
//# sourceMappingURL=bundle.js.map
