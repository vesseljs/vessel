import { Kernel } from '@vessel/core';

export function bootable(constructor: any) {
    const app = new constructor();
    new Kernel(app).boot();
}