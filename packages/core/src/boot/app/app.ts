import { isSupported } from '@vessel/core';
import { AppInterface } from '@vessel/types/definitions';

export abstract class AppBase implements AppInterface {

	public can;

	public constructor() {
		this.browserBoot();
	}

	public browserBoot(): AppInterface {
		this.detectBrowserFeatures();
		return this;
	}

	private detectBrowserFeatures(): AppInterface {
		this.can = {
			WeakMap: isSupported( (<any>window).WeakMap )
		};
		return this;
	}

	public abstract getGlobalName();
	public abstract register();

}
