import { MetadataManager } from '@vessel/core';
import { Container } from '@vessel/core';

/**
 * Loads the injector Container
 * and registers the MetadataManager
 * so the injector is ready to use.
 *
 * It is needed to use decorators which
 * use metadata and to inject dependencies.
 */
export class ContainerLoader {

    public constructor() {
        this.boot();
    }

    public boot() {
        return this.registerTo(new Container());
    }

    private registerTo(container) {
        container.registerSingleModule('@metadata_manager', MetadataManager);
        return container;
    }

}