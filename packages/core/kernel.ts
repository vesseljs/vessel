import { each } from '@vessel/core';

import { InjectorBoot } from '@vessel/injector';


export class Kernel {

    private app;

    public constructor(app) {
        this.app = app;
        this.init();
    }

    public registerPackages() {
        return [
            new InjectorBoot()
        ];
    }

    private registerDependencies() {
        let registrations = this.app.register();

        if (!this.app.container) {
            throw new Error("Cannot register dependencies without " +
                "the injector package.");
        }

        this.app.container.register(registrations);
    }

    private bootPackages() {
        let namespace = this.app,
            bootPackages = this.registerPackages();

        each(bootPackages, function(pkg){
            pkg.setup(namespace);
        });
    }

    private init() {
        this.bootPackages();
        this.registerDependencies();
    }


}