import { Vessel, isEmpty, toRegExpPath  } from '@vessel/core';
import { Route } from '../Route';

export function route(routeName, routePath=undefined) {
    return function(proto, name, descriptor) {
        let route,
            metadataManager = Vessel.$container.get('@metadata_manager'),
            routes = metadataManager.getRawData('cached_routes');

        if ( isEmpty(routes) ) routes = {};


        route = new Route(routeName);

        if (routePath) {
            route.setPath(routePath)
                 .setRegExpPath(toRegExpPath(routePath));
        }

        route.setBound(descriptor.value)
             .setContext(proto);

        routes[routeName] = route;

        metadataManager.addRawData('cached_routes', routes);
    }
}