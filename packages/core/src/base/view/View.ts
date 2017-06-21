import { Vessel, merge, BaseTypes } from '@vessel/core';

import { VirtualNode, VirtualDOM } from '@vessel/dom';


export abstract class View extends Vessel {

    protected _type = BaseTypes.VIEW;

    protected state: any = {};

    private $lastNode: VirtualNode;

    protected setState(state) {
        merge(this.state, state);
        return this;
    }

    public getLastNode(): VirtualNode {
        return this.$lastNode;
    }

    public setLastNode($node: VirtualNode): View {
        this.$lastNode = $node;

        return this;
    }

    public getParent(): string {
        return this.parent;
    }

    protected route(routeName, routeParams) {
        return this.get('@router').route(routeName, routeParams);
    }

    protected routeExec(routeName, ...args) {
        return this.get('@router').routeExec(routeName, args);
    }

    protected create(nodeType: string): VirtualNode {
        return VirtualDOM.create(nodeType);
    }

    abstract parent: string;
    abstract render(...args: any[]): VirtualNode;

}
