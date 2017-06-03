import { Vessel } from '@vessel/core';

/**
 * Decorator: @attr
 *
 * Adds the names of the custom model attributes to
 * the metadata manager.
 *
 * This will be used by the framework so it knows what
 * are the model attributes.
 *
 * @param proto
 * @param attrName
 */
export function attr(proto, attrName) {
    let metadataManager = Vessel.prototype.container.get('@metadata_manager'),
        className = proto.getClassName();

    metadataManager.setAttribute(className, attrName);
}