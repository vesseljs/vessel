import {isSupported, ContainerLoader, Container, BaseTypes} from "@vessel/core";

/**
 * Vessel's Main class.
 *
 * Base classes will inherit
 * this class.
 */
export class Vessel {

    protected _type = BaseTypes.VESSEL;

    /**
     * Container
     *
     * Vessel.$container is accessible
     * by decorators executed at runtime
     *
     */
    public static $container: Container = new ContainerLoader().boot();

    public static detectBrowserFeatures() {
        return {
            WeakMap: isSupported( (<any>window).WeakMap ),
            pushState: isSupported( <any>window.history )
            && isSupported( <any>window.history.pushState),
            onhashchange: "onhashchange" in window
        }
    }

    public static can = Vessel.detectBrowserFeatures();


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

    protected getType() {
        return this._type;
    }

    protected get(module: string): any {
        return this.container.get(module);
    }


}