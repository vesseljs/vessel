import { isArray, filterOne, filter, matchPair, map } from '@vessel/core';
import { ModelInterface } from '@vessel/types/definitions';
import { Vessel } from '../vessel'

let prefixAttr = 'attr';

export abstract class Collection extends Vessel {

    public __metadata__: string;
    public __dependencies__;
    private collection: ModelInterface[];

    public constructor() {
        super();
    }

    public add(...args) {
        let collection = this.getCollection(),
            Model = this.getModel();
        try {
            collection.push(new Model(...args));
        } catch(e) {
            if (e instanceof TypeError) {
                if ( !isArray(collection) ) {
                    console.error("TypeError: The collection '" +
                        this.__metadata__ + "' (" + typeof collection +
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
        return this[this.__metadata__];
    }

    abstract getModel();
}

Collection.prototype.__dependencies__ = [];