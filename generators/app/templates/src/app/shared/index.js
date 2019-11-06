// Components
import { ButtonPrimaryComponent } from './components/index';

export class Shared {
	constructor() {
		new ButtonPrimaryComponent();
	}

	static init() {
		const shared = new Shared();
		return shared;
	}
}
