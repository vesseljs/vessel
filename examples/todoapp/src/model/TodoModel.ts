import { Model as BaseModel } from '@vessel/core';
import { attr, validate } from '@vessel/decorators';
import { ModelInterface } from '@vessel/types';

export class TodoModel extends BaseModel implements ModelInterface {

    @attr
    public author;

    @attr
    public body;

    @attr
    public date;


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
    }

}