import { VirtualDOM } from '../vdom/VirtualDOM';
import { AbstractPackageBoot } from '@vessel/core';

export class VirtualDOMBoot extends AbstractPackageBoot {

    protected VERSION = '1.0.0-DEV';

    public register(container) {
        container.registerSingleModule('@vdom', VirtualDOM);
    }

    public setup(namespace, container) {
        namespace.vdom = container.get('@vdom');
    }

}


