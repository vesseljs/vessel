import { RouterBoot } from '@vessel/router';
import { VirtualDOMBoot } from '@vessel/dom';

import { app as appConfig } from './config/app';
import { modules } from './config/modules';
import { BaseApp } from '@vessel/core';
import { bootable } from '@vessel/decorators';

@bootable
class App extends BaseApp {

    public registerConfig() {
        return appConfig;
    }

    public registerModules() {
        return modules;
    }

    public registerPackages() {
        return [
            new RouterBoot(),
            new VirtualDOMBoot()
        ];
    }

    public getGlobalName() {
        return '$App';
    }

}