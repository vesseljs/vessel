export function getDate() {
    console.log('Get date!');
}
export function checkDate() {
    console.log('checkDate!');
}
export function isSupported(feature) {
    return typeof feature == 'function';
}
export function isArrayEmpty(arr) {
    return arr.length === 0;
}
export function findItem(arr, value) {
    return arr.indexOf(value) !== -1;
}
export function defineProp(obj, prop, getter, setter) {
    var descriptor = {
        enumerable: false,
        configurable: true,
        set: setter,
        get: getter
    };
    Object.defineProperty(obj, prop, descriptor);
}
//# sourceMappingURL=utilities.js.map