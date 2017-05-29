import { Kernel } from '@vessel/core';

function setGlobals(app) {
    window[app.getGlobalName()] = app;
}

export function bootable(constructor) {
    const app = new constructor();
    new Kernel(app);
    setGlobals(app);
}