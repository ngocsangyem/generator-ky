<% if (testFramework === 'mocha') { %>/*eslint no-unused-expressions:0 */
	<% } %>'use strict';
	
import { ButtonPrimaryComponent } from '../button-primary.component';
	
describe('ButtonPrimaryComponent View', function() {

	beforeEach(() => {
		this.buttonPrimary = new ButtonPrimaryComponent();
	});

	it('Should run a few assertions', () => {
		expect(this.buttonPrimary)<% if (testFramework === 'jasmine') { %>.toBeDefined()<% } else if (testFramework === 'mocha') { %>.to.exist<% } %>;
	});

});
