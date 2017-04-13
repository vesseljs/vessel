export function attr(proto, attribName) {
    proto.__metadata__.push(attribName);
}