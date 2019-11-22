<% if (testFramework === 'mocha') { %>/*eslint no-unused-expressions:0 */
	<% } %>'use strict';
	
import <%= _.pascalCase(name) %>Component from '../<%= name.replace(/\./g, "-").toLowerCase() %>.component';
	
describe('<%= _.pascalCase(name) %>Component View', function() {

	beforeEach(() => {
		this.<%= _.camelCase(name) %> = new <%= _.pascalCase(name) %>Component();
	});

	it('Should run a few assertions', () => {
		expect(this.<%= _.camelCase(name) %>)<% if (testFramework === 'jasmine') { %>.toBeDefined()<% } else if (testFramework === 'mocha') { %>.to.exist<% } %>;
	});
	
});
