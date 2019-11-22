var _ = require("lodash");
var path = require("path");
var Generator = require("yeoman-generator");
var config = require(path.join(process.cwd(), "./config.json"));
var directories = config.directories;
var copyTpl = require("../helpers/copy").copyTpl;
var RemoveVietnamese = require("../helpers/remove-vietnamese");

require("colors");
_.mixin({
	pascalCase: _.flow(
		_.camelCase,
		_.upperFirst
	)
});

module.exports = class extends Generator {
	initializing() {
		var fileJSON = this.config.get("config");
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

		this.name = "default-name";
		if (this.arguments[0]) {
			// Get the last piece of the path
			// Ex: `button` of `cool/awesome/button`
			this.name = this.arguments[0].split("/").slice(-1)[0];
		}

		this.arguments[0] = this.arguments[0].replace(/\./g, "-").toLowerCase();

		var componentDir = path.join(
			directories.source,
			directories.app,
			this.arguments[0]
		);

		// Clean each part of the passed in path into usable file paths
		// /each_sdf.SDF => /each_sdf/sdf
		this.path = this.name
			.split("/")
			.map(
				function(item) {
					return item.toLowerCase();
				}.bind(this)
			)
			.join("/");

		this.componentFile = path.join(
			componentDir,
			RemoveVietnamese(this.name)
		);

		this.testFile = path.join(
			componentDir,
			"tests",
			RemoveVietnamese(this.name)
		);
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

		var htmlSuffix = this.htmlOption === "pug" ? ".pug" : "";
		var jsSuffix = ".js";
		var cssSuffix = this.getCssSuffix(this.cssOption, this.sassSyntax);

		this.copyTpl(
			"component.component" + htmlSuffix,
			this.componentFile + ".component" + htmlSuffix,
			templateData
		);

		this.copyTpl(
			"component.component.json",
			this.componentFile + ".component.json",
			templateData
		);

		this.copyTpl(
			"component.component" + jsSuffix,
			this.componentFile + ".component" + ".js",
			templateData
		);

		this.copyTpl(
			"component.component.test" + jsSuffix,
			this.testFile + ".component" + ".test.js",
			templateData
		);

		this.copyTpl(
			"component.component.css",
			this.componentFile + ".component" + cssSuffix,
			templateData
		);
	}

	getCssSuffix(cssOption, sassSyntax) {
		var sassSuffix = sassSyntax === "sass" ? ".sass" : ".scss";

		var _result = ".css";
		_result = cssOption === "sass" ? sassSuffix : _result;

		return _result;
	}
};
