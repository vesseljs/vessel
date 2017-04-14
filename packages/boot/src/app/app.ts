import { isSupported } from '@vessel/common/utils';
import { WindowInterface, AppInterface } from '@vessel/types/definitions';

export class App implements AppInterface {

	public container;

	public browserBoot(): App {
		(<WindowInterface>window).$Vessel = this;
		this.detectBrowserFeatures()
			.loadContainer();
		return this;
	}

	private detectBrowserFeatures(): App {
		(<WindowInterface>window).$Vessel.can = {
			WeakMap: isSupported( (<any>window).WeakMap )
		}
		return this;
	}

	// TODO - WeakMap fallback
	private loadContainer(): App {
		 this.container =
             (<WindowInterface>window).$Vessel.can.WeakMap ?
                 new WeakMap() :
                 "Dev: WeakMap fallback - work in progress";
		return this;
	}
}
