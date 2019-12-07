export class <%= _.pascalCase(name) %>Component {
	constructor() {
		this.name = '<%= _.pascalCase(name) %>Component';
		console.log('page', this.name.toLowerCase());
	}
}
