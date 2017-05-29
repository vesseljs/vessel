import { registrations } from './config/register';
import { AppBase } from '@vessel/core';
import { bootable } from '@vessel/decorators';


@bootable
class App extends AppBase {

    public register() {
        return registrations;

    }

    public getGlobalName() {
        return '$App';
    }

}

