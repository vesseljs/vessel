import { RouterBoot } from '@vessel/router';

import { modules } from './config/modules';
import { BaseApp } from '@vessel/core';
import { bootable } from '@vessel/decorators';

import { MultipleKeyObject } from '@vessel/core';

@bootable
class App extends BaseApp {

    public registerModules() {
        return modules;

    }

    public registerPackages() {
        return [
            new RouterBoot()
        ];
    }

    public getGlobalName() {
        return '$App';
    }

}
