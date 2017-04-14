import { isSupported } from '@vessel/common/utils';
import { AppInterface } from '@vessel/types/definitions';

export class App implements AppInterface {

	public container;

	public can;

	public browserBoot(): AppInterface {
		this.detectBrowserFeatures();
		this.loadContainer();
		return this;
	}

	private detectBrowserFeatures(): AppInterface {
		this.can = {
			WeakMap: isSupported( (<any>window).WeakMap )
		}
		return this;
	}

	// TODO - WeakMap fallback
	private loadContainer(): AppInterface {
		 this.container =
             this.can.WeakMap ?
                 new WeakMap() :
                 "Dev: WeakMap fallback - work in progress";
		return this;
	}
}
