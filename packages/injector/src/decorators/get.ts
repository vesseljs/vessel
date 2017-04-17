/**
 * Decorator: @get(moduleName)
 *
 * Adds the dependencies to the
 * <Prototype>.dependenciesKEY. This will
 * be used by the framework so it knows what
 * are the dependencies that it will need.
 * The resolved module will be injected into
 * the applied attribute.
 *
 * Why Dependency Key?
 *
 * Since in javascript/ts decorators are executed
 * at runtime, we cannot access to instances, we
 * will be able to modify the prototype only.
 * That's great until developers extends its
 * classes (for example Model BasketBall extends
 * Model Ball), that said we need classes to have
 * its own metadata key which is accesible by
 * its children but each class will modify only
 * its own metadata key.
 *
 * Symbols and WeakMaps are great, but we need
 * a key variable to store them so the instance can
 * retrieve it later, and we have no access
 * to the instances, so we couldn't assign a different
 * symbol stored in the same variable in the prototype.
 *
 * We don't want private key properties between instances,
 * but between prototypes.
 *
 * @param depName
 * @returns {(constructor:any, attrName:any, $depName:any)=>undefined}
 */
export function get(depName) {
    return function(proto, attrName) {
        let className = proto._getClassName(),
            key = "__dependencies__" + className + "__";
        if (!proto.hasOwnProperty(key)) {
            proto[key] = [];
        }
        proto[key].push({
            attrName: attrName,
            depName: depName
        });
    }
}