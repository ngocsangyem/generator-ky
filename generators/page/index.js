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

		this.option("custom", {
			desc: "Custom page path to generate. ",
			type: String,
			required: false
		});

		this.name = "default-name";
		if (this.arguments[0]) {
			// Get the last piece of the path
			// Ex: `button` of `cool/awesome/button`
			this.name = this.arguments[0].split("/").slice(-1)[0];
		}

		this.custom = "";

		if (this.options.custom) {
			this.custom = this.options.custom;
			this.arguments[0] = this.arguments[0]
				.replace(/\./g, "-")
				.toLowerCase();
		}

		var pageDir = !this.custom
			? path.join(
					directories.source,
					directories.app,
					directories.pages,
					directories.views
			  )
			: path.join(directories.source, directories.app, this.arguments[0]);

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

		this.pageFile = !this.custom
			? path.join(
					pageDir,
					RemoveVietnamese(this.path),
					RemoveVietnamese(this.name)
			  )
			: path.join(pageDir, RemoveVietnamese(this.name));

		this.testFile = !this.custom
			? path.join(
					pageDir,
					RemoveVietnamese(this.path),
					"tests",
					RemoveVietnamese(this.name)
			  )
			: path.join(pageDir, "tests", RemoveVietnamese(this.name));
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
			"page.component" + htmlSuffix,
			this.pageFile + ".component" + htmlSuffix,
			templateData
		);

		this.copyTpl(
			"page.component.json",
			this.pageFile + ".component.json",
			templateData
		);

		this.copyTpl(
			"page.component" + jsSuffix,
			this.pageFile + ".component" + ".js",
			templateData
		);

		this.copyTpl(
			"page.component.test" + jsSuffix,
			this.testFile + ".component" + ".test.js",
			templateData
		);

		this.copyTpl(
			"page.component.css",
			this.pageFile + ".component" + cssSuffix,
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
