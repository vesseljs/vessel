import { Vessel } from "@vessel/core";

export class Router {

    public renderRoute(routeName, ...args) {
        let controller,
            route,
            cachedRoutes,
            container = Vessel.$container,
            metadataManager = container.get('@metadata_manager');

        cachedRoutes = metadataManager.getRawData('cached_routes');
        route = cachedRoutes.get(routeName);
        controller = container.loadModule(route.context.constructor);

        if (!route) {
            throw new TypeError("Cannot render non-existent route: '"+routeName+"'.");
        }

        return route.bound.call(controller, ...args);
    }

}