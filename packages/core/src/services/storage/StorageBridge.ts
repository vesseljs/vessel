import { Bridge } from '../Bridge';
import { BaseTypes } from '@vessel/core';

export abstract class StorageBridge extends Bridge {

    protected _type = BaseTypes.STORAGE_BRIDGE;

    public abstract fetch();

    public abstract save();
	
}