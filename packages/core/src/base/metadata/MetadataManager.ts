import { Metadata } from '@vessel/core';

/**
 * class MetadataManager.
 *
 * Provides a way to store/retrieve
 * metadata info. about classes.
 *
 * e.g. Which attributes are being used
 * by the model, what is the name of
 * the attribute in the collection which
 * is the model array or what are the
 * dependencies of a class.
 *
 */
export class MetadataManager {

    /**
     * Metadata container
     * for the loaded classes.
     */
    private cache = {};

    /**
     * Setter/getters for
     * built-in decorators.
     */

    public getDependencies(className) {
        return this.retrieve(className, Metadata.DEPENDENCIES_KEY);
    }

    public setDependency(className, dep) {
        this.createOrPush(className, Metadata.DEPENDENCIES_KEY, dep);
        return this;
    }

    public getAttributes(className) {
        return this.retrieve(className, Metadata.MODEL_ATTRIBUTES_KEY);
    }

    public setAttribute(className, attrName) {
        this.createOrPush(className, Metadata.MODEL_ATTRIBUTES_KEY, attrName);
        return this;
    }

    public getCollection(className) {
        return this.retrieve(className, Metadata.COLLECTION_ATTRIBUTE_KEY);
    }

    public setCollection(className, attrName) {
        this.loadClass(className)[Metadata.COLLECTION_ATTRIBUTE_KEY] = attrName;
        return this;
    }

    /**
     * Setter for add any kind of metadata,
     * so any dev can use decorators
     * which need metadata without
     * re-coding the core
     */
    public addMetadata(className, key, value) {
        this.loadClass(className)[key] = value;
        return this;
    }

    /**
     * Getter for the setter right above.
     */
    public getMetadata(className, key) {
        return this.retrieve(className, key);
    }

    /**
     * Checks if a given
     * className is
     * cached.
     */
    private has(className) {
        return this.cache.hasOwnProperty(className);
    }

    /**
     * Returns the class if it
     * exists or creates and returns
     * it if it doesn't.
     */
    private loadClass(className) {
        if (!this.has(className)) {
            this.cache[className] = {}
        }
        return this.cache[className];
    }

    /**
     * Retrieves the information
     * of metadata if it was
     * set before.
     */
    private retrieve(className, key) {
        if (!this.has(className)) {
            return undefined;
        }

        return this.cache[className][key];
    }

    private createOrPush(className, key, value) {
        let cached = this.loadClass(className);

        if (!cached.hasOwnProperty(key)) {
            cached[key] = [];
        }

        cached[key].push(value);
        return value;
    }

}