"use strict";

var path = require("path");
var Generator = require("yeoman-generator");
var _ = require("lodash");
var commandExists = require("command-exists").sync;
var copyTpl = require("../helpers/copy").copyTpl;
var copy = require("../helpers/copy").copy;
require("colors");

// Copy file
var rootFile = require("./config/_root");
var projectTpl = require("./config/_projectTpl");
var scriptTpl = require("./config/_scriptTpl");
var gulp = require("./config/_gulp");
var gulpTpl = require("./config/_gulpTpl");
var pug = require("./config/_pug");
var sass = require("./config/_sass");
var scss = require("./config/_scss");
var testing = require("./config/_testing");
var browserifyBundle = require("./config/_browserify");
var webpackBundle = require("./config/_webpack");
var dataJson = require("./config/_data");

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);

		this.rootFile = rootFile;
		this.projectTpl = projectTpl;
		this.scriptTpl = scriptTpl;
		this.gulp = gulp;
		this.gulpTpl = gulpTpl;
		this.pug = pug;
		this.sass = sass;
		this.scss = scss;
		this.testing = testing;
		this.browserifyBundle = browserifyBundle;
		this.webpackBundle = webpackBundle;
		this.dataJson = dataJson;
	}

	initializing() {
		this.pkg = require(path.join(__dirname, "../../package.json"));
		// Setup copy helpers
		this.copy = copy.bind(this);
		this.copyTpl = copyTpl.bind(this);
	}

	async prompting() {
		const existingYoConfig = this.config.get("config");

		const answers_11 = await this.prompt([
			{
				type: "confirm",
				name: "existingConfig",
				message:
					"Existing .yo-rc configuration found, would you like to use it?",
				default: true,
				when: function() {
					return Boolean(existingYoConfig);
				}
			},
			{
				type: "input",
				name: "authorName",
				message: "Your name"
			},
			{
				type: "input",
				name: "authorEmail",
				message: "Your email"
			},
			{
				type: "input",
				name: "projectName",
				message:
					"What would you like to" + " name your project".blue + "?",
				default: path.basename(process.cwd()),
				when: function(answers_1) {
					return !answers_1.existingConfig;
				}
			},
			{
				type: "list",
				name: "htmlOption",
				message:
					"Which " +
					"HTML preprocessor".blue +
					" would you like to use?",
				choices: ["Pug"],
				when: function(answers_3) {
					return !answers_3.existingConfig;
				},
				filter: function(val_1) {
					var filterMap = {
						Pug: "pug"
					};
					return filterMap[val_1];
				}
			},
			{
				type: "list",
				name: "cssOption",
				message:
					"What would you like to use to " +
					"write styles".blue +
					"?",
				choices: ["Sass"],
				when: function(answers_5) {
					return !answers_5.existingConfig;
				},
				filter: function(val_3) {
					var filterMap_1 = {
						Sass: "sass"
					};
					return filterMap_1[val_3];
				}
			},
			{
				when: function(answers_7) {
					return (
						answers_7.cssOption === "sass" &&
						!answers_7.existingConfig
					);
				},
				type: "list",
				name: "sassSyntax",
				message:
					"What " + "Sass syntax".blue + " would you like to use ?",
				choices: ["Scss", "Sass"],
				when: function(answers_8) {
					return (
						!answers_8.existingConfig &&
						answers_8.cssOption === "sass"
					);
				},
				filter: function(val_5) {
					var filterMap_2 = {
						Scss: "scss",
						Sass: "sass"
					};
					return filterMap_2[val_5];
				}
			},
			{
				type: "list",
				name: "jsOption",
				message:
					"Which bundle module " +
					"Javascript".blue +
					" would you like to use?",
				choices: ["Browserify", "Webpack"],
				when: function(answers_9) {
					return !answers_9.existingConfig;
				},
				filter: function(val_6) {
					var filterMap_3 = {
						Browserify: "browserify",
						Webpack: "webpack"
					};
					return filterMap_3[val_6];
				}
			},
			{
				type: "list",
				name: "testFramework",
				message:
					"Which JavaScript " +
					"testing framework".blue +
					" would you like to use?",
				choices: ["Jasmine", "Mocha", "None"],
				when: function(answers_10) {
					return !answers_10.existingConfig;
				},
				filter: function(val_7) {
					var filterMap_4 = {
						Jasmine: "jasmine",
						Mocha: "mocha",
						None: "none"
					};
					return filterMap_4[val_7];
				}
			}
		]);
		let _answers = answers_11.existingConfig
			? this.config.get("config")
			: answers_11;
		// Assign each answer property to `this` context to give the generator access to it
		// Project Info
		this.projectName = _answers.projectName;
		// Client
		this.authorName = _answers.authorName;
		this.authorEmail = _answers.authorEmail;
		this.htmlOption = _answers.htmlOption;
		this.jsFramework = _answers.jsFramework;
		this.jsOption = _answers.jsOption;
		this.cssOption = _answers.cssOption;
		this.sassSyntax = _answers.sassSyntax;
		this.extras = _answers.extras;
		// Default to mocha for testing (cannot use jasmine server-side)
		_answers.testFramework = _answers.testFramework || "mocha";
		// Testing
		this.testFramework = _answers.testFramework;
		// Default jsOption to Webpack
		this.jsOption = _answers.jsOption || "webpack";
		// If user chooses to use exsiting yo-rc file, then skip prompts
		if (!answers_11.existingConfig) {
			// Create .yo-rc.json file
			this.config.set("config", _answers);
		}
		this.config.set("version", this.pkg.version);
		this.config.save();
	}

	writing() {
		const templateData = {
			_: _,
			appname: this.appname,
			date: new Date().toISOString().split("T")[0],
			pkg: this.pkg,
			projectName: this.projectName,
			authorName: this.authorName,
			authorEmail: this.authorEmail,
			htmlOption: this.htmlOption,
			jsFramework: this.jsFramework,
			jsOption: this.jsOption,
			cssOption: this.cssOption,
			sassSyntax: this.sassSyntax,
			extras: this.extras,
			testFramework: this.testFramework,
			jsOption: this.jsOption
		};

		this.rootFile.files.forEach(file => {
			this.copy(file.src, file.dest);
		});

		this.projectTpl.files.forEach(file => {
			this.copyTpl(file.src, file.dest, templateData);
		});

		this.scriptTpl.files.forEach(file => {
			this.copyTpl(file.src, file.dest, templateData);
		});

		this.gulp.files.forEach(file => {
			this.copy(file.src, file.dest);
		});

		this.gulpTpl.files.forEach(file => {
			this.copyTpl(file.src, file.dest, templateData);
		});

		this.dataJson.files.forEach(file => {
			this.copyTpl(file.src, file.dest, templateData);
		});

		if (this.jsOption === "browserify") {
			this.browserifyBundle.files.forEach(file => {
				this.copyTpl(file.src, file.dest, templateData);
			});
		} else if (this.jsOption === "webpack") {
			this.webpackBundle.files.forEach(file => {
				this.copyTpl(file.src, file.dest, templateData);
			});
		}

		if (this.htmlOption === "pug") {
			this.pug.files.forEach(file => {
				this.copyTpl(file.src, file.dest, templateData);
			});
		}

		if (this.cssOption === "sass") {
			if (this.sassSyntax === "sass") {
				this.sass.files.forEach(file => {
					this.copyTpl(file.src, file.dest, templateData);
				});
			} else {
				this.scss.files.forEach(file => {
					this.copyTpl(file.src, file.dest, templateData);
				});
			}
		}

		if (this.testFramework !== "none") {
			this.testing.files.forEach(file => {
				this.copyTpl(file.src, file.dest, templateData);
			});
		}

		// Install dependencies
		const hasYarn = commandExists("yarn");
		this.installDependencies({
			npm: !hasYarn,
			yarn: hasYarn,
			bower: false,
			skipInstall: this.options["skip-install"]
		});

		this.on("end", () => {
			// Format files with prettier
			this.spawnCommand("npm", ["run", "format"]);
			this.log(
				"\n" +
					"Everything looks ready!".blue +
					' Get started by running "' +
					"npm start".green +
					'".\n'
			);
		});
	}
};
