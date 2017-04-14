/**
 * Decorator: @attr
 *
 * Adds the names of the custom attributes to
 * <ModelPrototype>.__metadata__. This will
 * be used by the framework so it knows what
 * are the model attributes that it will need.
 *
 * @param proto
 * @param attrName
 */
export function attr(proto, attrName) {
    proto.__metadata__.push(attrName);
}