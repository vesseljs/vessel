import { Vessel } from '@vessel/core';

export function route(routeName, routePath=undefined) {
    return function(proto, name, descriptor) {
        let metadata,
            className = proto.getClassName(),
            metadataManager = Vessel.prototype.container.get('@metadata_manager');

        metadata = metadataManager.getMetadata(className, 'routes');

        if (!metadata) {
            metadata = {};
        }

        metadata[routeName] = {
            path: routePath,
            bound: descriptor.value,
            context: proto
        };

        metadataManager.addMetadata(className, 'routes', metadata);
    }
}