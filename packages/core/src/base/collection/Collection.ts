import {
    Vessel,
    Model,
    filterOne,
    filter,
    matchPair,
    map,
    BaseTypes,
    isEmpty,
    puck,
    findBy
} from '@vessel/core';
// import { ModelInterface } from '@vessel/types/definitions';


export abstract class Collection extends Vessel {

    protected _type = BaseTypes.COLLECTION;

    protected _collection = [];

    protected model;

    /**
     * Stores the bridge service.
     */
    protected bridge: string;

    // TODO - Add addSource so models can be added
    // from objects.

    public add(model) {
        let collection = this.getCollection();

        if (! (model instanceof this.getModel()) ) {
            throw new TypeError(this.getClassName() + ': cannot ' +
                'add ' + model + ' (' + typeof model + ') as a model of ' +
                this.getModel().getClassName());
        }

        collection.push(model);

        return model;
    }

    public fetch(requestOptions=null) {
        return this.getBridge().readRequest(this, requestOptions);
    }

    public find(attrs) {
        return filterOne(this.getCollection(), function(item){
            return matchPair(item[Model.MODEL_PROXY_PROPERTY_NAME], attrs);
        });
    }

    public findAll(attrs) {
        return filter(this.getCollection(), function(item){
            return matchPair(item[Model.MODEL_PROXY_PROPERTY_NAME], attrs);
        });
    }

    public pull(attrName) {
        return map(this.getCollection(), function(item){
            return item[Model.MODEL_PROXY_PROPERTY_NAME][attrName];
        });
    }

    public getLastId(attrib: string = 'id') {
        let id,
            attrName,
            singleModel,
            collection = this.getCollection();
        if ( isEmpty(collection) ) {
            return 0;
        }
        return Math.max(...puck(collection, attrib));
    }


    public sort() {

    }

    public remove() {

    }

    public removeById() {

    }

    protected getModel() {
        return this.model;
    }

    protected getCollection() {
        return this._collection;
    }

    public setCollection(collection: Array<any>) {
        this._collection = collection;

        return this;
    }

    protected getBridge() {
        let bridge = this.bridge;

        if (!bridge) {
            throw new TypeError("Bridge does not exist. Define a bridge " +
                "for " + this.getClassName());
        }
        return this.get(bridge);
    }

}