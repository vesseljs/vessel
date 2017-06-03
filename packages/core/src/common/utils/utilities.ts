export function getDate() {
	console.log('Get date!');
}

export function checkDate() {
	console.log('checkDate!');
}

export function isSupported( feature ) {
	return typeof feature == 'function';
}

export function isArray( arr ) {
    return Array.isArray(arr);
}

export function isArrayEmpty( arr ) {
    if (!arr) return true;
    if (arr.length === 0) return true;
    return false;
}

export function findItem( arr, value ) {
    return arr.indexOf(value) !== -1
}

export function isFunction( fn ) {
    if ( fn == undefined ) return false;
    if ( typeof fn !== "function" ) return false;
    return true;
}

export function isObject(exp: any) {
    return typeof exp === "object";
}

export function toInitialUpperCase( string ) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function defineProp( obj, prop, getter, setter ) {
    let descriptor = {
        enumerable: false,
        configurable: true,
        set: setter,
        get: getter
    }
    Object.defineProperty( obj, prop, descriptor );
}

export function getKeys(obj) {
    return Object.keys(obj);
}

export function each(obj, fn, context=null) {
    var i, len, keys, item, result;
    if (!obj) return;
    if (isArray(obj)) {
        for (i = 0, len = obj.length; i < len; i++) {
            result = fn.call(context, obj[i], i, obj);
        }
    } else {
        keys = getKeys(obj);
        for (i = 0, len = keys.length; i < len; i++) {
            item = keys[i];
            result = fn.call(context, item, obj[item], obj);
        }
    }
    return result;
}

export function matchPair(obj, attrs) {
    var keys = getKeys(attrs),
        len = keys.length,
        key, i;
    for (i = 0; i < len; i++) {
        key = keys[i];
        if (attrs[key] !== obj[key] || !(key in obj))
            return false;
    }
    return true;
}

export function map(arr, fn, context=null) {
    var newArr = [], result;
    each(arr, function(item, index) {
        result = fn.call(context, item, index);
        if ( result ) newArr.push(result);
    });
    return newArr;
}

export function filter(obj, fn, context=null) {
    var matches = [];
    each(obj, function(item, index) {
        if (fn.call(context, item, index, obj))
            matches.push(item);
    });
    return matches;
}

export function filterOne(arr, fn, context=null) {
    var i, item, len = arr.length;
    for (i = 0; i < len; i++) {
        if (fn.call(context, item = arr[i], i, arr))
            return item;
    }
    return false;
}

export function merge(obj, obj2) {
    let prop;
    for (prop in obj2) {
        try {
            obj[prop] = isObject(obj2[prop]) ? merge(obj[prop], obj2[prop]) : obj2[prop];
        } catch (e) {
            obj[prop] = obj2[prop];
        }
    }
}