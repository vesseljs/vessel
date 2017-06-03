import { modules } from './config/modules';
import { BaseApp } from '@vessel/core';
import { bootable } from '@vessel/decorators';


@bootable
class App extends BaseApp {

    public registerModules() {
        return modules;

    }

    public registerPackages() {
        return [
        ];
    }

    public getGlobalName() {
        return '$App';
    }

}
