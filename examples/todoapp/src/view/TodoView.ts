import { View } from '@vessel/core';
import { VirtualDOM } from '@vessel/dom';

export class TodoView extends View {

    public parent = '#todo-root';

    public constructor() {
        super();
        this.onRefresh = this.onRefresh.bind(this);
    }

    public onRefresh() {
        this.renderRoute('todo_edit', { id: ++this.state.id } );
    }

    public render() {
        let div, p, i, button, input,
            self = this;

        div = this.create('div')
            .set({
                'class' : 'todo-class'
            })
            .css({
                'color': 'red'
            });

        p = this.create('p')
            .text("I'm the todo id ")
            .appendTo(div);

        i = this.create('i')
            .text(this.state.id)
            .appendTo(p);

        input = this.create('input')
            .set({
                'id': 'input'
            })
            .appendTo(div);

        button = this.create('button')
            .text("Refresh")
            .click(self.onRefresh)
            .appendTo(div);

        return div;
    }

}