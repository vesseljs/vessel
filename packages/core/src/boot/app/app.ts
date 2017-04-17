import { isSupported } from '@vessel/core';
import { AppInterface } from '@vessel/types/definitions';

export class App implements AppInterface {

	public can;

	public browserBoot(): AppInterface {
		this.detectBrowserFeatures();
		return this;
	}

	private detectBrowserFeatures(): AppInterface {
		this.can = {
			WeakMap: isSupported( (<any>window).WeakMap )
		}
		return this;
	}

}
