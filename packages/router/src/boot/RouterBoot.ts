import { Router } from '../Router';
import { AbstractPackageBoot } from '@vessel/core';

export class RouterBoot extends AbstractPackageBoot {

    protected VERSION = '1.0.0-DEV';

    public register(container) {
        container.registerSingleModule('@router', Router);
    }

    public setup(namespace, container) {
        let router = container.get('@router');
        namespace.router = router;
        router.boot();
    }

}


