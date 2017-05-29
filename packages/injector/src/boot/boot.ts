import { Container } from "../container";

export class InjectorBoot {

    public setup(namespace) {
        return namespace.container = new Container();
    }

}
