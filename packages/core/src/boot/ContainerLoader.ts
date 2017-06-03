import { MetadataManager } from '@vessel/core';
import { Container } from '@vessel/injector';

export class ContainerLoader {

    public constructor() {
        this.boot();
    }

    public boot() {
        return this.registerTo(new Container());
    }

    private registerTo(container) {
        return container.registerSingleModule('@metadata_manager', MetadataManager);
    }

}