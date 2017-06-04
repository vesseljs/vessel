import { Vessel } from '@vessel/core';
/**
 * Decorator: @collection
 *
 * Adds the name of the custom collection attribute to
 * the metadata manager.
 *
 * This will be used by the framework so it knows
 * what is the collection array attribute which
 * will be used to store the models.
 *
 *
 * @param proto
 * @param attrName
 */
export function collection(proto: any, attrName: string){
    let metadataManager = Vessel.$container.get('@metadata_manager'),
        className = proto.getClassName();

    metadataManager.setCollection(className, attrName);
}