import { Bridge } from '../Bridge';
import { BaseTypes } from '@vessel/core';

export abstract class HttpBridge extends Bridge {

    protected _type = BaseTypes.HTTP_BRIDGE;

    public abstract create(response, model);

    public abstract read(response, obj);

    public abstract update(response, model);

    public abstract destroy(response);

}