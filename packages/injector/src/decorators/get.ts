import { Vessel } from '@vessel/core';

/**
 * Decorator: @get(moduleName)
 *
 * Uses the @metadata_manager service
 *
 *
 * @param depName
 */
/*
export function get(depName) {
    return function(proto, attrName) {
        let className = proto.getClassName(),
            key = "__dependencies__" + className + "__";
        if (!proto.hasOwnProperty(key)) {
            proto[key] = [];
        }
        proto[key].push({
            attrName: attrName,
            depName: depName
        });
    }
}*/

export function get(depName) {
    return function(proto, attrName) {
        let metadataManager = Vessel.prototype.container.get('@metadata_manager'),
            className = proto.getClassName();

        metadataManager.setDependency(className, {
            attrName: attrName,
            depName: depName
        });
    }
}