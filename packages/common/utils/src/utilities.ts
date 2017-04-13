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
    return arr.length === 0
}

export function findItem( arr, value ) {
    return arr.indexOf(value) !== -1
}

export function isFunction( fn ) {
    if ( fn == undefined ) return false;
    if ( typeof fn !== "function" ) return false;
    return true;
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