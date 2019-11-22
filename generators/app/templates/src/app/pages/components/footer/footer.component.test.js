<% if (testFramework === 'mocha') { %>/*eslint no-unused-expressions:0 */
	<% } %>'use strict';
	
import { FooterComponent } from '../footer.component';
	
describe('FooterComponent View', function() {

	beforeEach(() => {
		this.footer = new FooterComponent();
	});

	it('Should run a few assertions', () => {
		expect(this.footer)<% if (testFramework === 'jasmine') { %>.toBeDefined()<% } else if (testFramework === 'mocha') { %>.to.exist<% } %>;
	});

});
