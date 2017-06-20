import {Vessel, each } from '@vessel/core';

/**
 * Heart of Vessel.
 *
 * Manages the packages, services,
 * injector and configuration.
 */
export class Kernel {

    private VERSION = '1.0.0-PRE';

    private app;

    public constructor(app) {
        this.app = app;
    }

    public boot() {
        this.setGlobals()
            .init();
    }

    public setGlobals() {
        window[this.app.getGlobalName()] = this.app;
        return this;
    }

    get container() {
        return Vessel.$container;
    }

    private setAppContainer(container) {
        this.app.container = container;
        return this;
    }

    private registerDependencies(container) {
        let registrations = this.app.registerModules();
        container.register(registrations);
        return this;
    }

    private bootPackages() {
        let bootPackages = this.app.registerPackages();
        return this.loadPackages([bootPackages]);
    }

    private loadPackages(arr) {
        let namespace = this.app,
            container = namespace.container;
        each(arr, function(pkgs) {
           each(pkgs, function(pkg){
               pkg.register(container);
               pkg.setup(namespace, container);
           });
        });
        return this;
    }

    private registerAppConfig() {
        let config = this.app.registerConfig();
        return this.container.get('@metadata_manager')
                   .setConfig(config);
    }

    private init() {

        let container = this.container;

        if (!container) {
            throw new Error("Cannot register dependencies without " +
                "the injector package.");
        }

        this.registerDependencies(container)
            .setAppContainer(container)
            .bootPackages()
            .registerAppConfig();

        return this;
    }

}