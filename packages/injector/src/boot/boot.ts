import { Container } from "../container";

export function setupContainer(namespace ) {
    return namespace.container = new Container();
}