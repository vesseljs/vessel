import { Vessel, isArray, filterOne, filter, matchPair, map, BaseTypes } from '@vessel/core';
import { ModelInterface } from '@vessel/types/definitions';

let prefixAttr = 'attr';

export abstract class Collection extends Vessel {

    protected _type = BaseTypes.COLLECTION;

    public collection: ModelInterface[];

    public model;

    public add(...args) {
        let collection = this.getCollection(),
            Model = this.model;
        try {
            collection.push(new Model(...args));
        } catch(e) {
            if (e instanceof TypeError) {
                if ( !isArray(collection) ) {
                    console.error("TypeError: The collection '" +
                        collection+ "' (" + typeof collection +
                        ") must be an array.");
                }
            }
        }
    }

    public find(attrs) {
        return filterOne(this.getCollection(), function(item){
            return matchPair(item[prefixAttr], attrs);
        });
    }

    public findAll(attrs) {
        return filter(this.getCollection(), function(item){
            return matchPair(item[prefixAttr], attrs);
        });
    }

    public pull(attrName) {
        return map(this.getCollection(), function(item){
            return item[prefixAttr][attrName];
        });
    }

    public sort() {

    }

    public remove() {

    }

    public removeById() {

    }

    public save() {

    }

    public fetch() {

    }

    protected willRetrieve() {
        return this;
    }

    protected getCollection() {
        let name,
            metadataManager = this.get('@metadata_manager');

         name = metadataManager.getCollection(this.getClassName());

        return this[name];
    }

}