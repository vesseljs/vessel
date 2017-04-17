/**
 * Decorator: @collection
 *
 * Adds the name of the custom attribute to
 * <CollectionPrototype>.__metadata__. This
 * will be used by the framework so it knows
 * what is the collection attribute which
 * will store the models.
 *
 * @param proto
 * @param attrName
 */
/**
 * Decorator: @collection
 *
 * Adds the name of the custom attribute to
 * <CollectionPrototype>.__metadata__. This
 * will be used by the framework so it knows
 * what is the collection attribute which
 * will store the models.
 *
 * @param proto
 * @param attrName
 */ export function collection(proto, attrName) {
    proto.__metadata__ = attrName;
}
//# sourceMappingURL=collection.js.map