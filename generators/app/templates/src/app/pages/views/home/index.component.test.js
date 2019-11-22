<% if (testFramework === 'mocha') { %>/*eslint no-unused-expressions:0 */
	<% } %>'use strict';
	
import { IndexComponent } from '../index.component';
	
describe('IndexComponent View', function() {

	beforeEach(() => {
		this.index = new IndexComponent();
	});

	it('Should run a few assertions', () => {
		expect(this.index)<% if (testFramework === 'jasmine') { %>.toBeDefined()<% } else if (testFramework === 'mocha') { %>.to.exist<% } %>;
	});

});
