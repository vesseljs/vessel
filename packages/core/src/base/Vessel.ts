import { ContainerLoader, Container } from "@vessel/core";
/**
 * Vessel's Main class.
 *
 * Models, views, collections
 * will inherit this class.
 */
export class Vessel {

    /**
     * Container
     *
     * Vessel.$container is accessible
     * by decorators executed at runtime
     *
     */
    public static $container: Container = new ContainerLoader().boot();

    /**
     * Container: Alias
     *
     * Alias so the instances of Views,
     * Collections, Services, etc. can
     * access container with this.container
     *
     */
    get container(): Container {
        return Vessel.$container;
    }

    protected getClassName(): string {
        return this.constructor.name;
    }

    protected get(module: string): any {
        return this.container.get(module);
    }


}