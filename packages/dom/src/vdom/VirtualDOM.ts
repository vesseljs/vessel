import {Vessel, Types, isString, each, isEvent, formatEvent} from '@vessel/core';
import { VirtualNode } from '../vnode/VirtualNode';


export class VirtualDOM {

    public static create(type): VirtualNode {
        return new VirtualNode(type);
    }

    public render(viewName: string, renderData: any) {
        let $new, $old, parent,
            view = Vessel.$container.get(viewName);

        view.setState(renderData);

        $new = view.render();
        $old = view.getLastNode();
        parent = view.getParentElement();

        return view.setLastNode( this.updateNode(parent, $new, $old) );
    }

    public unrender(viewName: string) {
        let view,
            container = Vessel.$container;

        view = container.get(viewName);

        this.removeChild(view.getParentElement(), view.getLastNode().index());
        return Vessel.$container.remove(view);
    }


    public updateNode(parent, $newNode, $oldNode=undefined, childIndex = 0) {
        if (!$newNode) {
            this.removeChild(parent, childIndex);
        } else if (!$oldNode) {
            this.appendChild(parent, $newNode);
        } else if (this.hasChanged($newNode, $oldNode)) {
            this.replaceChild(parent, $newNode, childIndex);
        } else if ($newNode.type) {
            let nextParent = parent.childNodes[childIndex],
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

        if (isString($node)) {
            return document.createTextNode($node);
        }

        let $child,
            elem = document.createElement($node.type),
            children = $node.children;

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

    private hasChanged($node1, $node2): boolean {
        return typeof $node1 !== typeof $node2 ||
            typeof $node1 === Types.STRING && $node1 !== $node2 ||
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
