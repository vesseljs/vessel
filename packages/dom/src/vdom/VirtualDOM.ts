import {Vessel, BaseTypes, isEmpty, each, isEvent, formatEvent} from '@vessel/core';
import { VirtualNode } from '../vnode/VirtualNode';
import {VirtualTextNode} from "../vnode/VirtualTextNode";

// TODO - Split up VirtualNode, VirtualElementNode, VirtualTextNode
// and patch system.

export class VirtualDOM {

    public static create(type): VirtualNode {
        return new VirtualNode(type);
    }

    public render(viewName: string, renderData: any=undefined) {
        let $new, $old, parent,
            view = Vessel.$container.get(viewName);

        if (view.isStatic() && view.isRendered()) {
            return false;
        }

        view.setState(renderData);

        $new = view.render();
        $old = view.getLastNode();
        parent = view.getParentElement();

        view.setRendered(true);

        return view.setLastNode( this.updateNode(parent, $new, $old) );
    }

    public unrender(viewName: string) {
        let view,
            $lastNode,
            container = Vessel.$container;

        view = container.get(viewName);
        $lastNode = view.getLastNode();

        if (!$lastNode) {
            return false;
        }

        this.removeChild(view.getParentElement(), $lastNode.index());
        view.setLastNode(void 0);
        view.setRendered(false);
        return Vessel.$container.remove(view);
    }

    // This code will be deprecated on next version
    public updateNode(parent, $newNode, $oldNode=undefined, childIndex = 0) {
        if (!$newNode) {
            this.removeChild(parent, childIndex);
        } else if (!$oldNode) {
            this.appendChild(parent, $newNode);
        } else if (this.hasChanged($newNode, $oldNode)) {
            this.replaceChild(parent, $newNode, childIndex);
        } else {
            $newNode.setEl($oldNode.el());
            if ($newNode.type) {
                let nextParent = !parent
                        ? void 0
                        : parent.childNodes[childIndex],
                    newChildrenLen = $newNode.children.length,
                    oldChildrenLen = $oldNode.children.length,
                    newAttr = $newNode.attributes,
                    oldAttr = $oldNode.attributes;

                for (let attrName in newAttr || oldAttr) {
                    this.updateAttribute(
                        nextParent,
                        attrName,
                        newAttr[attrName],
                        oldAttr[attrName]
                    );
                }

                for (let currentChild = 0; currentChild < newChildrenLen || currentChild < oldChildrenLen; currentChild++) {
                    let $new = $newNode.children[currentChild],
                        $old = $oldNode.children[currentChild];
                    this.updateNode(nextParent, $new, $old, currentChild);
                }
            }
        }
        return $newNode;
    }

    private updateAttribute(elem, attrName, newValue, oldValue) {
        if (!newValue) {
            this.removeAttribute(elem, attrName, oldValue)
        } else if (!oldValue || oldValue !== newValue) {
            this.setAttribute(elem, attrName, newValue);
        }
    }


    private createRealElement($node: any ): any {

        let elem;

        if (this.isVirtualTextNode($node)) {
            elem = document.createTextNode($node.getContent());
            $node.setEl(elem);
            return elem;
        }

        let $child,
            children = $node.children;

        elem = document.createElement($node.type);
        this.setAttributes(elem, $node.attributes);

        if (children) {
            for (let i = 0, len = children.length; i < len; i++) {
                $child = children[i];
                elem.appendChild(this.createRealElement($child));
            }
        }

        $node.setEl(elem);

        return elem;

    }

    private isVirtualTextNode($node) {
        return $node.getType() === BaseTypes.VirtualTextNode;
    }

    // hasChanged is a subject to change when the new
    // patch system arrives.
    private hasChanged($node1, $node2): boolean {
        return typeof $node1 !== typeof $node2 ||
            this.isVirtualTextNode($node1) && this.isVirtualTextNode($node2) && $node1.getContent() !== $node2.getContent() ||
            $node1.type != $node2.type;
    }

    private setAttribute(elem, name, value) {
        elem.setAttribute(name, value);
    }

    private removeAttribute(elem, name, value) {
        elem.removeAttribute(name, value);
    }

    private setAttributes(elem, attributes) {
        each(attributes, function(name, value){
            if (isEvent(name)) {
                this.addEvent(elem, name, value);
            } else {
                this.setAttribute(elem, name, value);
            }
        }, this);
    }

    private addEvent(elem, eventName, boundFn) {
        return elem.addEventListener(formatEvent(eventName), boundFn);
    }

    private removeChild(parent, index) {
        parent.removeChild(parent.childNodes[index]);
    }

    private appendChild(parent, $newNode) {
        parent.appendChild(this.createRealElement($newNode));
    }

    private replaceChild(parent, $newNode, index) {
        parent.replaceChild(this.createRealElement($newNode), parent.childNodes[index]);
    }
}
