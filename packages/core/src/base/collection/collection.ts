import { isArray } from "@vessel/common/utils";

export abstract class Collection {

    public __metadata__: string;

    public constructor() {
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

    public find(exp) {

    }

    public findOne() {

    }

    public findById() {

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

    public pull() {

    }

    protected willRetrieve() {
        return this;
    }

    private getCollection() {
        let collection = this[this.__metadata__];
        return collection;
    }

    abstract getModel();
}