import {toString, merge, each, Vessel, BaseTypes} from '@vessel/core';
import {VirtualTextNode} from "./VirtualTextNode";

// TODO - Split up VirtualNode, VirtualElementNode, VirtualTextNode
// and patch system.

export class VirtualNode {

    private _type = BaseTypes.VirtualElementNode;

    public type;

    public children = [];

    public attributes = {};

    private element = null;

    public getType() {
        return this._type;
    }

    public constructor(type) {
        this.type = type;
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

    public set(props) {
        merge(this.attributes, props);
        return this;
    }

    public text(str: string) {
        let $textNode = new VirtualTextNode(toString(str)),
            children = this.children;
        if (children.length === 0) children.push($textNode);
        return this;
    }

    public appendTo($parent) {
        $parent.children.push(this);
        return this;
    }

    public append($child) {
        this.children.push($child);
        return this;
    }

    public css(attrs) {
        let style = '';
        each(attrs, function(attr, value){
           style += attr + ":" + value + ";";
        });
        return this.set({
            'style': style
        });
    }
    
    public link(url) {
        return this.set({
            href: url
        });
    }

    public event(name, fn) {
        this.attributes[name] = fn;
        return this;
    }

    public click(fn) {
        return this.set({
            'onclick': fn
        })
    }

    public dblClick(fn) {
        return this.set({
            'ondblclick': fn
        })
    }

    public change(fn) {
        return this.set({
            'onchange': fn
        })
    }

    public mouseOver(fn) {
        return this.set({
            'onmouseover': fn
        })
    }

    public mouseMove(fn) {
        return this.set({
            'onmousemove': fn
        })
    }

    public mouseOut(fn) {
        return this.set({
            'onmouseout': fn
        })
    }

    public mouseEnter(fn) {
        return this.set({
            'onmouseenter': fn
        })
    }

    public mouseLeave(fn) {
        return this.set({
            'onmouseleave': fn
        })
    }

    public mouseUp(fn) {
        return this.set({
            'onmouseup': fn
        })
    }

    public keyDown(fn) {
        return this.set({
            'onkeydown': fn
        })
    }

    public keyUp(fn) {
        return this.set({
            'onkeyup': fn
        })
    }

    public keyPress(fn) {
        return this.set({
            'onkeypress': fn
        })
    }

    public resize(fn) {
        return this.set({
            'onresize': fn
        })
    }

    public focus(fn) {
        return this.set({
            'onfocus': fn
        })
    }

    public focusIn(fn) {
        return this.set({
            'onfocusin': fn
        })
    }

    public focusOut(fn) {
        return this.set({
            'onfocusout': fn
        })
    }

    public select(fn) {
        return this.set({
            'onselect': fn
        })
    }

    public model() {

    }

}