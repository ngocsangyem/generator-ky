import ButtonPrimaryComponent from './button-primary.component';
describe('ButtonPrimaryComponent View', function() {
	beforeEach(() => {
		this.buttonprimary = new ButtonPrimaryComponent();
	});

	it('Should run a few assertions', () => {
		expect(this.buttonprimary).to.exist;
	});
});
