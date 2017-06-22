import {BaseTypes} from "@vessel/core";

// Subject to change when new patch system arrives.

export class VirtualTextNode {

    private _type = BaseTypes.VirtualTextNode;

    private content;

    private element = null;

    public getType() {
        return this._type;
    }

    public constructor(content) {
        this.content = content;
    }

    public setContent(content) {
        this.content = content;

        return this;
    }

    public getContent() {
        return this.content;
    }

    public setEl(elem: HTMLElement) {
        this.element = elem;
        return this;
    }

    public el() {
        return this.element;
    }

    public index() {
        // Internet explorer 6,7,8 will include
        // comment nodes.
        // https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/children#Browser_compatibility
        //
        let el = this.el();
        return Array.prototype.indexOf.call(el.parentElement.children, el);
    }

}