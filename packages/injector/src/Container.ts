import { getKeys, each, findItem, merge } from '@vessel/core';

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
export class Container {

    private modules = {};

    private cache = new WeakMap();

    public register(opts) {
        merge(this.modules, opts);
        return this;
    }

    public registerSingleModule(name, module) {

        if (!module) {
            throw TypeError("Cannot registerSingleModule(name, module). 'module' was " + module);
        }

        let modules = this.modules;

        if (!modules.hasOwnProperty("@")) {
            modules["@"] = {}
        }

        modules["@"][name] = module;

        return this;
    }

    /**
     * Gets a given module name.
     */
    public get(name) {
        return this.resolveDependencies(name);
    }

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
    private getDependencies(className) {
        let metadataConstructor = this.modules['@']['@metadata_manager'],
            metadataManager = this.loadModule(metadataConstructor);
        return metadataManager.getDependencies(className);
    }

    /**
     * Resolves dependencies for a given module, recursively
     * injecting its dependencies.
     */
    private resolveDependencies(name) {
        let constructor = this.findModuleByName(name);

        if (!constructor) {
            throw new TypeError("Attempt to get " +
                "non-existent module: '" +
                name +"'. Did you register it?");
        }

        let dependencies = this.getDependencies(constructor.name),
            topParent = {
                name: name,
                constructor: constructor
            };

        each(dependencies, function(item){
            this.inject(item.depName, item.attrName, topParent);
        }, this);

        return this.loadModule(constructor);
    }

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
    private inject(depName, attrName, topParent, parents=[], constructor=null) {
        let depConstructor = this.findModuleByName(depName);

        if (!depConstructor) {
            throw new TypeError("Attempt to inject " +
                "non-existent dependency: '" +
                depName +"'. Did you register it?");
        }

        if (this.isCircular(depName, parents, topParent.name)) {
            throw new RangeError("Circular dependency detected: "+
                "module injection was impossible. Attempting to "+
                "inject '" + depName + "' which have tried to "+
                "resolve a parent dependency.");
        }

        let depDependencies = this.getDependencies(depConstructor.name);

        parents.push(depName);

        each(depDependencies, function(dep) {
            this.inject(dep.depName, dep.attrName, topParent, parents, depConstructor);
        }, this);

        // Only the top-parent dependency enters here.

        if (parents.length === 1) {
            // Inject the very first parent dependency
            // to the module prototype.
            let topParentInstance = this.loadModule(topParent.constructor),
                topDependencyInstance = this.loadModule(depConstructor);
            return topParentInstance[attrName] = topDependencyInstance;
        }

        // Children dependencies enter here.

        parents.pop();
        // Inject the dependency to the parent prototype.
            let topDepInstance = this.loadModule(constructor),
                depInstance = this.loadModule(depConstructor);
        return topDepInstance[attrName] = depInstance;
    }

    /**
     * Loads a module by its constructor,
     * if it's already instantiated it will
     * return the instance, otherwise it will
     * instantiate and then return it.
     */
    private loadModule(constructor) {
        let cache = this.cache;

        if (!cache.has(constructor))
            cache.set(constructor, new constructor());

        return cache.get(constructor);
    }

    /**
     * Find a module by its name, when a
     * match is found, the loop stops.
     *
     * Returns the constructor if a module
     * is found.
     */
    private findModuleByName(queryName) {
        let modules = this.modules,
            keys = getKeys(modules),
            len = keys.length;
        for (let i = 0; i < len; i++) {
            let moduleType = keys[i],
                module = modules[moduleType];
            if (module && module.hasOwnProperty(queryName))
                return modules[moduleType][queryName];
        }
        return null;
    }

    private isCircular(depName, parents, topParentName) {
        return depName === topParentName || findItem(parents, depName);
    }
}