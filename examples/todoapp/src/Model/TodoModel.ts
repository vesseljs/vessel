import { Model as BaseModel } from '@vessel/core';
import { attr } from '@vessel/common/decorators';

export class TodoModel extends BaseModel {

    @attr
    public author;

    @attr
    public body;

    @attr
    public date;

    constructor(author, body ) {
        super();
        this.set({
            author: author,
            body: body
        })
    }

    getAuthor() {
        return this.attr.author;
    }

    setAuthor( value ) {
        this.attr.author = value;
    }

    getBody() {
        return this.attr.body;
    }

    setBody( value ) {
        this.attr.body = value;
    }

}