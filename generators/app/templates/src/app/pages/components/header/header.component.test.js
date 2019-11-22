<% if (testFramework === 'mocha') { %>/*eslint no-unused-expressions:0 */
	<% } %>'use strict';
	
import { HeaderComponent } from '../header.component';
	
describe('HeaderComponent View', function() {

	beforeEach(() => {
		this.header = new HeaderComponent();
	});

	it('Should run a few assertions', () => {
		expect(this.header)<% if (testFramework === 'jasmine') { %>.toBeDefined()<% } else if (testFramework === 'mocha') { %>.to.exist<% } %>;
	});

});
