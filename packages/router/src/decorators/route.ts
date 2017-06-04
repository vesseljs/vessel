import { Vessel, MultipleKeyObject } from '@vessel/core';

export function route(routeName, routePath=undefined) {
    return function(proto, name, descriptor) {
        let routes,
            metadataManager = Vessel.$container.get('@metadata_manager');

        routes = metadataManager.getRawData('cached_routes');

        if (!routes) {
            routes = new MultipleKeyObject();
        }

        routes.set([routeName, routePath], {
            routeName: routeName,
            routePath: routePath,
            bound: descriptor.value,
            context: proto
        });

        metadataManager.addRawData('cached_routes', routes);
    }
}