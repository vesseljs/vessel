
export function attr( modelPrototype, attribName ) {
    modelPrototype.__metadata__.push( attribName );
}