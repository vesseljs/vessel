export function getDate() {
	console.log('Get date!');
}

export function checkDate() {
	console.log('checkDate!');
}

export function isSupported( feature ) {
	return typeof feature == 'function';
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