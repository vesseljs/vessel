import { Vessel, getKeys, each, findItem, merge } from '@vessel/core';

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
    public getDependencies(className) {
        let metadataManager = this.loadDependency('@', '@metadata_manager');
        return metadataManager.getDependencies(className);
    }

    /**
     * Resolves dependencies for a given module, recursively
     * injecting its dependencies.
     */
    private resolveDependencies(name) {
        let match = this.findModuleByName(name);

        if (!match) {
            throw new TypeError("Attempt to get " +
                "non-existent module: '" +
                name +"'. Did you register it?");
        }

        let moduleType = match.type,
            constructor = match.constructor,
            dependencies = this.getDependencies(constructor.name),
            topParent = {
                name: name,
                constructor: constructor
            };

        each(dependencies, function(item){
            this.inject(item.depName, item.attrName, [], null, topParent);
        }, this);

        return this.loadDependency(moduleType, name);
    }

    private inject(depName, attrName, parents=[], constructor=null, topParent) {
        let depType,
            depDependencies,
            depConstructor,
            match = this.findModuleByName(depName);

        if (!match) {
            throw new TypeError("Attempt to inject " +
                "non-existent dependency: '" +
                depName +"'. Did you register it?");
        }

        depType = match.type;
        depConstructor = match.constructor;
        depDependencies = this.getDependencies(depConstructor.name);

        if (this.isCircular(depName, parents, topParent)) {
            throw new RangeError("Circular dependency detected: "+
                "module injection was impossible. Attempting to "+
                "inject '" + depName + "' which have tried to "+
                "resolve a parent dependency.");
        }

        parents.push(depName);

        each(depDependencies, function(item) {
            this.inject(item.depName,
                item.attrName,
                parents,
                depConstructor,
                topParent);
        }, this);

        // Only the top-parent dependency enters here.

        if (parents.length === 1) {
            // Inject the very first parent dependency
            // to the module prototype.
            return topParent.constructor.prototype[attrName] = this.loadDependency(depType, depName);
        }

        // Children dependencies enter here.

        parents.pop();
        // Inject the dependency to the parent prototype.
        return constructor.prototype[attrName] = this.loadDependency(depType, depName);
    }

    private loadDependency(type, name) {
        let constructor = this.modules[type][name];

        if (type !== 'models')
            return this.loadModule(constructor);

        return constructor;
    }

    private loadModule(constructor) {
        let cache = this.cache;

        if (!cache.has(constructor))
            cache.set(constructor, new constructor());

        return cache.get(constructor);
    }

    private findModuleByName(queryName) {
        let i,
            moduleType,
            module,
            modules = this.modules,
            keys = getKeys(modules),
            len = keys.length;
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
    }

    private isCircular(depName, parents, topParent) {
        return depName === topParent.name || findItem(parents, depName);
    }
}