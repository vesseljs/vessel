import { Model as BaseModel } from '@vessel/core';
import { attr, identifier, validate } from '@vessel/decorators';

export class TodoModel extends BaseModel {

    @identifier
    @attr
    public id;

    @attr
    public author;

    @attr
    public body;

    @attr
    public date;

    protected bridge = 'service.todo';


    getId() {
        return this.attr.id;
    }

    setId(value) {
        this.attr.id = value;

        return this
    }


    getAuthor() {
        return this.attr.author;
    }

    @validate(
        function validateAuthor(value) {
            if (!(value.length >= 3 && value.length <= 20) ) {
                console.warn("Author length must be greater " +
                    "than 3 characters or less than 20.");
                return false;
            }
            return true;
        }
    )
    setAuthor(value) {
        this.attr.author = value;

        return this;
    }

    getBody() {
        return this.attr.body;
    }

    @validate(
        function validateBody(value) {
            if (!(value.length >= 0 && value.length <= 120) ) {
                throw TypeError("Body length must be less " +
                    "than 120 characters and must not be empty.");
            }
            return true;
        }
    )
    setBody(value) {
        this.attr.body = value;

        return this;
    }

}