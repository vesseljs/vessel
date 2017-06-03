import {Vessel, each } from '@vessel/core';

export class Kernel {

    private app;

    public constructor(app) {
        this.app = app;
    }

    public boot() {
        this.setGlobals();
        this.init();
    }

    public setGlobals() {
        window[this.app.getGlobalName()] = this.app;
    }

    private getContainer() {
        return Vessel.prototype.container;
    }

    private setAppContainer(container) {
        this.app.container = container;
    }

    private registerDependencies(container) {
        let registrations = this.app.registerModules();
        container.register(registrations);
        return this;
    }

    private bootPackages() {
        let bootPackages = this.app.registerPackages();
        this.loadPackages([bootPackages]);
    }

    private loadPackages(arr) {
        each(arr, function(pkgs) {
           each(pkgs, function(pkg){
               pkg.setup(this.app);
           });
        });
        return this;
    }

    private init() {
        this.bootPackages();

        let container = this.getContainer();

        if (!container) {
            throw new Error("Cannot register dependencies without " +
                "the injector package.");
        }

        this.registerDependencies(container)
            .setAppContainer(container);
    }

}