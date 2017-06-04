import { defineProp } from '@vessel/core';
/**
 * MultipleKeyObject
 *
 * Provides a way to set
 * values with multiple keys.
 *
 */
export class MultipleKeyObject {

    private container = {};

    public set(keyGroup, value) {
        let masterKey = keyGroup[0];
        for (let i = 0, len = keyGroup.length; i < len; i++) {
            let key = keyGroup[i];
            if (this.has(key)) {
                return this.container[key] = value;
            }

            if (key) {
                defineProp(this.container, key,
                function getter() {
                    return this["$"+masterKey];
                }, function setter(v) {
                    return this["$"+masterKey] = v;
                });
            }
        }
        return this.container[masterKey] = value;
    }

    public has(key) {
        return this.container.hasOwnProperty(key);
    }

    public get(key) {
        return this.container[key];
    }

}