import { ModelInterface } from "../interfaces";

export abstract class Collection {

    public add() {

    }

    public find() {

    }

    public findById() {

    }

    public remove() {

    }

    public removeById() {

    }

    public update() {

    }

    protected willRetrieve() {
        return this;
    }

    abstract getModel(): ModelInterface;
}