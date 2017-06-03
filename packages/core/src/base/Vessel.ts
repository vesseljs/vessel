import { ContainerLoader } from "@vessel/core";
/**
 * Vessel's Main class.
 *
 * Models, views, collections
 * will inherit this class.
 */
export class Vessel {

    public container;

    protected getClassName(): string {
        return this.constructor.name;
    }

    protected get(module) {
        return this.container.get(module);
    }
}

Vessel.prototype.container = new ContainerLoader().boot();