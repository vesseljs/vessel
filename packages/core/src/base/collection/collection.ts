import { isArray, filterOne, filter, matchPair, map } from '@vessel/core';
import { ModelInterface } from '@vessel/types/definitions';

let prefixAttr = 'attr';

export abstract class Collection {

    private className = this._getClassName();
    private metadataKey = "__metadata__" + this.className + "__";
    private collection: ModelInterface[];


    public add(...args) {
        let collection = this.getCollection(),
            Model = this.getModel();
        try {
            collection.push(new Model(...args));
        } catch(e) {
            if (e instanceof TypeError) {
                if ( !isArray(collection) ) {
                    console.error("TypeError: The collection '" +
                        this.metadataKey + "' (" + typeof collection +
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

    public update() {

    }

    public save() {

    }

    public fetch() {

    }

    protected willRetrieve() {
        return this;
    }

    private getCollection() {
        return this[this[this.metadataKey]];
    }

    private _getClassName(): string {
        return this.constructor.name;
    }

    abstract getModel();


}