import { Vessel } from '@vessel/core';

/**
 * Decorator: @attr
 *
 * Adds the name of the identifier attribute to
 * the metadata manager.
 *
 * This will be used by the framework so it knows what
 * are the model identifier.
 *
 * @param proto
 * @param attrName
 */
export function identifier(proto, attrName) {
    let metadataManager = Vessel.$container.get('@metadata_manager'),
        className = proto.getClassName();

    metadataManager.setIdentifier(className, attrName);
}