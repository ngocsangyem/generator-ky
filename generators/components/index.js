'use strict';

var _ = require('lodash');
var path = require('path');
var Generator = require('yeoman-generator');
var config = require(path.join(process.cwd(), './config.json'));
var directories = config.directories;
var copyTpl = require('../helpers/copy').copyTpl;

require('colors');
_.mixin({
	pascalCase: _.flow(
		_.camelCase,
		_.upperFirst
	)
});

module.exports = class extends Generator {
	initializing() {
		var fileJSON = this.config.get('config');
		// Setup copy helpers
		this.copyTpl = copyTpl.bind(this);

		// options
		this.projectName = fileJSON.projectName;
		this.jsFramework = fileJSON.jsFramework;
		this.singlePageApplication = fileJSON.singlePageApplication;
		this.jsTemplate = fileJSON.jsTemplate;
		this.cssOption = fileJSON.cssOption;
		this.sassSyntax = fileJSON.sassSyntax;
		this.testFramework = fileJSON.testFramework;
		this.htmlOption = fileJSON.htmlOption;

		var moduleDir = config
			? path.join(
					directories.source,
					directories.app,
					directories.pages,
					directories.component
			  )
			: `src/app/pages/components`;
		// Clean each part of the passed in path into usable file paths
		// /each_sdf.SDF => /each_sdf/sdf

		this.path = this.name
			.split('/')
			.map(
				function(item) {
					return item.toLowerCase();
				}.bind(this)
			)
			.join('/');

		this.moduleFile = path.join(moduleDir, this.path, this.name);
		this.testFile = path.join(moduleDir, this.path, 'tests', this.name);
	}

	writing() {
		const templateData = {
			_: _,
			name: this.name,
			testFramework: this.testFramework
		};

		if (this.abort) {
			return;
		}

		var htmlSuffix = this.htmlOption === 'pug' ? '.component.pug' : '';
		var jsSuffix = '.component.js';
		var cssSuffix = this.getCssSuffix(this.cssOption, this.sassSyntax);

		this.copyTpl(
			'module' + htmlSuffix,
			this.moduleFile + htmlSuffix,
			templateData
		);
		this.copyTpl(
			'module' + jsSuffix,
			this.moduleFile + '.component.js',
			templateData
		);
		this.copyTpl(
			'module.test' + jsSuffix,
			this.testFile + '.component.test.js',
			templateData
		);
		this.copyTpl('module.css', this.moduleFile + cssSuffix, templateData);
	}

	getCssSuffix(cssOption, sassSyntax) {
		var sassSuffix =
			sassSyntax === 'sass' ? '.component.sass' : '.component.scss';

		var _result = '.component.css';
		_result = cssOption === 'sass' ? sassSuffix : _result;

		return _result;
	}
};
