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

function matchPair(obj, attribs) {
    var keys = Object.keys(attribs),
        len = keys.length,
        key, i;
    for (i=0; i < len; i++) {
        key = keys[i];
        if (attribs[key] !== obj[key] || !(key in obj))
            return false;
    }
    return true;
}

function filter(objArr, attribs) {
    var matches = [], len = objArr.length, i, value;
    for (i=0; i < len; i++) {
        if (matchPair(value = objArr[i], attribs))
            matches.push(value);
    }
    return matches;
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