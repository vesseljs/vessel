import { Vessel } from '@vessel/core';

/**
 * Decorator: @get(moduleName)
 *
 * Uses the @metadata_manager service
 *
 *
 * @param depName
 */
export function get(depName) {
    return function(proto, attrName) {
        let metadataManager = Vessel.$container.get('@metadata_manager'),
            className = proto.getClassName();

        metadataManager.setDependency(className, {
            attrName: attrName,
            depName: depName
        });
    }
}