import { getKeys, each, findItem } from '@vessel/core';

export class Container {

    private modules = {};

    private cache = new WeakMap();

    public register(opts) {
        this.modules = opts;
        return this;
    }

    public get(name) {
        return this.resolveDependencies(name);
    }

    private resolveDependencies(name) {
        let match = this.findModuleByName(name);

        if (!match) {
            throw new TypeError("Attempt to get " +
                "non-existent module: '" +
                name +"'. Did you register it?");
        }

        let moduleType = match.type,
            constructor = match.constructor,
            key = "__dependencies__" + constructor.name + "__",
            dependencies = constructor.prototype[key],
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
        let key,
            depType,
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
        key = "__dependencies__" + depConstructor.name + "__";
        depDependencies = depConstructor.prototype[key];

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
            if (module.hasOwnProperty(queryName))
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