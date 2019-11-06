'use strict';

var path = require('path');
var Generator = require('yeoman-generator');
var _ = require('lodash');
var commandExists = require('command-exists').sync;
var copyTpl = require('../helpers/copy').copyTpl;
var copy = require('../helpers/copy').copy;
require('colors');

module.exports = class extends Generator {
	initializing() {
		this.pkg = require(path.join(__dirname, '../../package.json'));
		// Setup copy helpers
		this.copy = copy.bind(this);
		this.copyTpl = copyTpl.bind(this);
	}

	async prompting() {
		const existingYoConfig = this.config.get('config');

		const answers_11 = await this.prompt([
			{
				type: 'confirm',
				name: 'existingConfig',
				message:
					'Existing .yo-rc configuration found, would you like to use it?',
				default: true,
				when: function() {
					return Boolean(existingYoConfig);
				}
			},
			{
				type: 'input',
				name: 'projectName',
				message:
					'What would you like to' + ' name your project'.blue + '?',
				default: 'Sample',
				when: function(answers_1) {
					return !answers_1.existingConfig;
				}
			},
			{
				type: 'list',
				name: 'htmlOption',
				message:
					'Which ' +
					'HTML preprocessor'.blue +
					' would you like to use?',
				choices: ['Pug', 'Nunjucks'],
				when: function(answers_3) {
					return !answers_3.existingConfig;
				},
				filter: function(val_1) {
					var filterMap = {
						Pug: 'pug'
					};
					return filterMap[val_1];
				}
			},
			{
				type: 'list',
				name: 'cssOption',
				message:
					'What would you like to use to ' +
					'write styles'.blue +
					'?',
				choices: ['Sass', 'PostCSS'],
				when: function(answers_5) {
					return !answers_5.existingConfig;
				},
				filter: function(val_3) {
					var filterMap_1 = {
						Sass: 'sass'
					};
					return filterMap_1[val_3];
				}
			},
			{
				when: function(answers_7) {
					return (
						answers_7.cssOption === 'sass' &&
						!answers_7.existingConfig
					);
				},
				type: 'list',
				name: 'sassSyntax',
				message:
					'What ' + 'Sass syntax'.blue + ' would you like to use ?',
				choices: ['Scss', 'Sass'],
				when: function(answers_8) {
					return (
						!answers_8.existingConfig &&
						answers_8.cssOption === 'sass'
					);
				},
				filter: function(val_5) {
					var filterMap_2 = {
						Scss: 'scss',
						Sass: 'sass'
					};
					return filterMap_2[val_5];
				}
			},
			{
				type: 'list',
				name: 'testFramework',
				message:
					'Which JavaScript ' +
					'testing framework'.blue +
					' would you like to use?',
				choices: ['Jasmine', 'Mocha', 'None'],
				when: function(answers_10) {
					return !answers_10.existingConfig;
				},
				filter: function(val_7) {
					var filterMap_3 = {
						Jasmine: 'jasmine',
						Mocha: 'mocha',
						None: 'none'
					};
					return filterMap_3[val_7];
				}
			}
		]);
		let _answers = answers_11.existingConfig
			? this.config.get('config')
			: answers_11;
		// Assign each answer property to `this` context to give the generator access to it
		// Project Info
		this.projectName = _answers.projectName;
		// Client
		this.htmlOption = _answers.htmlOption;
		this.jsFramework = _answers.jsFramework;
		this.jsOption = _answers.jsOption;
		this.cssOption = _answers.cssOption;
		this.sassSyntax = _answers.sassSyntax;
		this.extras = _answers.extras;
		// Default to mocha for testing (cannot use jasmine server-side)
		_answers.testFramework = _answers.testFramework || 'mocha';
		// Testing
		this.testFramework = _answers.testFramework;
		// Default jsOption to Browserify
		this.jsOption = _answers.jsOption || 'browserify';
		// If user chooses to use exsiting yo-rc file, then skip prompts
		if (!answers_11.existingConfig) {
			// Create .yo-rc.json file
			this.config.set('config', _answers);
		}
		this.config.set('version', this.pkg.version);
		this.config.save();
	}

	writing() {
		const templateData = {
			_: _,
			appname: this.appname,
			date: new Date().toISOString().split('T')[0],
			pkg: this.pkg,
			projectName: this.projectName,
			htmlOption: this.htmlOption,
			jsFramework: this.jsFramework,
			jsOption: this.jsOption,
			cssOption: this.cssOption,
			sassSyntax: this.sassSyntax,
			extras: this.extras,
			testFramework: this.testFramework,
			jsOption: this.jsOption
		};

		// Root file
		this.copyTpl('gulpfile.babel.js', 'gulpfile.babel.js', templateData);
		this.copyTpl('.babelrc', '.babelrc', templateData);
		this.copyTpl('_package.json', 'package.json', templateData);
		this.copyTpl('README.md', 'README.md', templateData);
		this.copy(
			'src/static/img/GitHub-Mark.png',
			'src/assets/img/GitHub-Mark.png'
		);

		this.copy('gitignore', '.gitignore');
		this.copy('browserslistrc', '.browserslistrc');
		this.copy('component', 'component.js');
		this.copy('config.json', 'config.json');
		this.copy('csscomb.json', 'csscomb.json');
		this.copy('editorconfig', '.editorconfig');
		this.copy('plugins.json', 'plugins.json');
		if (this.htmlOption === 'pug') {
			this.copy('seo.json', 'seo.json');
		}
		this.copy('travis.yml', '.travis.yml');

		/**
		 * Scripts
		 */
		this.copyTpl('src/app/main.js', 'src/app/main.js', templateData);
		// Pages
		this.copyTpl('src/shared/pages/index.js', 'src/app/pages/index.js');
		this.copyTpl(
			'src/app/pages/components/index.js',
			'src/app/pages/components/index.js'
		);
		this.copyTpl(
			'src/app/pages/components/footer/footer.component.js',
			'src/app/pages/components/footer/footer.component.js'
		);
		this.copyTpl(
			'src/app/pages/components/header/header.component.js',
			'src/app/pages/components/header/header.component.js'
		);
		this.copyTpl(
			'src/app/pages/views/index.js',
			'src/app/pages/views/index.js'
		);
		this.copyTpl(
			'src/app/pages/views/home/index.component.js',
			'src/app/pages/views/home/index.component.js'
		);
		// Shared
		this.copyTpl('src/app/shared/index.js', 'src/app/shared/index.js');
		this.copyTpl(
			'src/app/shared/components/index.js',
			'src/app/shared/components/index.js'
		);
		this.copyTpl(
			'src/app/shared/components/button-primary/button-primary.component.js',
			'src/app/shared/components/button-primary/button-primary.component.js'
		);
		// Gulp files
		this.copyTpl('gulp/utils.js', 'gulp/utils.js', templateData);
		this.copyTpl(
			'gulp/helpers/capitalize.js',
			'gulp/helpers/capitalize.js',
			templateData
		);
		this.copyTpl(
			'gulp/helpers/remove-dash.js',
			'gulp/helpers/remove-dash.js',
			templateData
		);
		this.copyTpl(
			'gulp/helpers/remove-extension.js',
			'gulp/helpers/remove-extension.js',
			templateData
		);
		this.copyTpl(
			'gulp/helpers/remove-vietnamese.js',
			'gulp/helpers/remove-vietnamese.js',
			templateData
		);
		this.copyTpl(
			'gulp/tasks/author.js',
			'gulp/tasks/author.js',
			templateData
		);
		this.copyTpl(
			'gulp/tasks/browserify.js',
			'gulp/tasks/browserify.js',
			templateData
		);
		this.copyTpl(
			'gulp/tasks/browserSync.js',
			'gulp/tasks/browserSync.js',
			templateData
		);
		this.copyTpl(
			'gulp/tasks/clean.js',
			'gulp/tasks/clean.js',
			templateData
		);
		this.copyTpl(
			'gulp/tasks/component.js',
			'gulp/tasks/component.js',
			templateData
		);
		this.copyTpl(
			'gulp/tasks/concat.js',
			'gulp/tasks/concat.js',
			templateData
		);
		this.copyTpl('gulp/tasks/done.js', 'gulp/tasks/done.js', templateData);
		this.copyTpl(
			'gulp/tasks/eslint.js',
			'gulp/tasks/eslint.js',
			templateData
		);
		this.copyTpl(
			'gulp/tasks/fonts.js',
			'gulp/tasks/fonts.js',
			templateData
		);
		this.copyTpl(
			'gulp/tasks/images.js',
			'gulp/tasks/images.js',
			templateData
		);
		// this.copyTpl(
		// 	'gulp/tasks/injectJs.js',
		// 	'gulp/tasks/injectJs.js',
		// 	templateData
		// );
		// this.copyTpl(
		// 	'gulp/tasks/injectSass.js',
		// 	'gulp/tasks/injectSass.js',
		// 	templateData
		// );
		if (this.htmlOption === 'pug') {
			this.copyTpl(
				'gulp/tasks/pug.js',
				'gulp/tasks/pug.js',
				templateData
			);
			this.copyTpl(
				'gulp/tasks/pug-data.js',
				'gulp/tasks/pug-data.js',
				templateData
			);
		}
		this.copyTpl('gulp/tasks/rev.js', 'gulp/tasks/rev.js', templateData);
		if (this.cssOption === 'sass') {
			this.copyTpl(
				'gulp/tasks/sass.js',
				'gulp/tasks/sass.js',
				templateData
			);
		}
		this.copyTpl(
			'gulp/tasks/sitemap.js',
			'gulp/tasks/sitemap.js',
			templateData
		);
		this.copyTpl('gulp/tasks/size.js', 'gulp/tasks/size.js', templateData);
		this.copyTpl(
			'gulp/tasks/sprite.js',
			'gulp/tasks/sprite.js',
			templateData
		);
		this.copyTpl('gulp/tasks/zip.js', 'gulp/tasks/zip.js', templateData);

		// Markup (HTML Preprocessors)

		if (this.htmlOption === 'pug') {
			this.copyTpl(
				'src/app/pages/components/footer/footer.component.pug',
				'src/app/pages/components/footer/footer.component.pug',
				templateData
			);
			this.copyTpl(
				'src/app/pages/components/footer/footer.component.json',
				'src/app/pages/components/footer/footer.component.json',
				templateData
			);
			this.copyTpl(
				'src/app/pages/components/header/header.component.pug',
				'src/app/pages/components/header/header.component.pug',
				templateData
			);
			this.copyTpl(
				'src/app/pages/components/header/header.component.json',
				'src/app/pages/components/header/header.component.json',
				templateData
			);
			this.copyTpl(
				'src/app/pages/views/home/index.component.pug',
				'src/app/pages/views/home/index.component.pug',
				templateData
			);
			this.copyTpl(
				'src/app/pages/views/home/index.component.json',
				'src/app/pages/views/home/index.component.json',
				templateData
			);
			this.copyTpl(
				'src/app/pages/layouts/layout.pug',
				'src/app/pages/layouts/layout.pug',
				templateData
			);
			this.copyTpl(
				'src/app/pages/layouts/_includes/css.pug',
				'src/app/pages/layouts/_includes/css.pug',
				templateData
			);
			this.copyTpl(
				'src/app/pages/layouts/_includes/scripts.pug',
				'src/app/pages/layouts/_includes/scripts.pug',
				templateData
			);
			this.copyTpl(
				'src/app/pages/layouts/_includes/seo.pug',
				'src/app/pages/layouts/_includes/seo.pug',
				templateData
			);
			this.copyTpl(
				'src/app/pages/layouts/_includes/variables.pug',
				'src/app/pages/layouts/_includes/variables.pug',
				templateData
			);
			this.copyTpl(
				'src/app/pages/layouts/_includes/watermark.pug',
				'src/app/pages/layouts/_includes/watermark.pug',
				templateData
			);
			this.copyTpl(
				'src/app/pages/layouts/_mixins/bemto.pug',
				'src/app/pages/layouts/_mixins/bemto.pug',
				templateData
			);
			this.copyTpl(
				'src/app/pages/layouts/_mixins/lib/bemto_custom_tag.pug',
				'src/app/pages/layouts/_mixins/lib/bemto_custom_tag.pug',
				templateData
			);
			this.copyTpl(
				'src/app/pages/layouts/_mixins/lib/bemto_tag.pug',
				'src/app/pages/layouts/_mixins/lib/bemto_tag.pug',
				templateData
			);
			this.copyTpl(
				'src/app/pages/layouts/_mixins/lib/bemto.pug',
				'src/app/pages/layouts/_mixins/lib/bemto.pug',
				templateData
			);
			this.copyTpl(
				'src/app/pages/layouts/_mixins/lib/helpers.pug',
				'src/app/pages/layouts/_mixins/lib/helpers.pug',
				templateData
			);
			this.copyTpl(
				'src/app/pages/layouts/_mixins/lib/index.pug',
				'src/app/pages/layouts/_mixins/lib/index.pug',
				templateData
			);
			this.copyTpl(
				'src/app/pages/layouts/_mixins/lib/README.md',
				'src/app/pages/layouts/_mixins/lib/README.md',
				templateData
			);
			this.copyTpl(
				'src/app/pages/layouts/_mixins/lib/settings.pug',
				'src/app/pages/layouts/_mixins/lib/settings.pug',
				templateData
			);
			this.copyTpl(
				'src/app/pages/layouts/_mixins/lib/tag_metadata.pug',
				'src/app/pages/layouts/_mixins/lib/tag_metadata.pug',
				templateData
			);
			this.copyTpl(
				'src/app/shared/components/button-primary/button-primary.component.pug',
				'src/app/shared/components/button-primary/button-primary.component.pug',
				templateData
			);
		}

		// Styling (CSS Preprocessors)

		if (this.cssOption === 'sass') {
			if (this.sassSyntax === 'sass') {
				this.copyTpl(
					'src/app/main.sass',
					'src/app/main.sass',
					templateData
				);
				this.copyTpl(
					'src/app/pages/index.sass',
					'src/app/pages/index.sass',
					templateData
				);
				this.copyTpl(
					'src/app/pages/components/index.sass',
					'src/app/pages/components/index.sass',
					templateData
				);
				this.copyTpl(
					'src/app/pages/components/footer/footer.component.sass',
					'src/app/pages/components/footer/footer.component.sass',
					templateData
				);
				this.copyTpl(
					'src/app/pages/components/header/header.component.sass',
					'src/app/pages/components/header/header.component.sass',
					templateData
				);
				this.copyTpl(
					'src/app/pages/views/index.sass',
					'src/app/pages/views/index.sass',
					templateData
				);
				this.copyTpl(
					'src/app/pages/views/home/index.component.sass',
					'src/app/pages/views/home/index.component.sass',
					templateData
				);
				this.copyTpl(
					'src/app/shared/index.sass',
					'src/app/shared/index.sass',
					templateData
				);
				this.copyTpl(
					'src/app/components/index.sass',
					'src/app/components/index.sass',
					templateData
				);
				this.copyTpl(
					'src/app/components/button-primary/button-primarycomponent.sass',
					'src/app/components/button-primary/button-primarycomponent.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/index.sass',
					'src/app/styles/sass/index.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/base/breakpoint.sass',
					'src/app/styles/sass/base/breakpoint.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/base/colors.sass',
					'src/app/styles/sass/base/colors.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/base/fonts.sass',
					'src/app/styles/sass/base/fonts.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/base/global.sass',
					'src/app/styles/sass/base/global.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/base/typography.sass',
					'src/app/styles/sass/base/typography.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/mixins.sass',
					'src/app/styles/sass/mixins.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/functions/_array.sass',
					'src/app/styles/sass/functions/_array.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/functions/_colors.sass',
					'src/app/styles/sass/functions/_colors.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/functions/_complex.sass',
					'src/app/styles/sass/functions/_complex.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/functions/_exist.sass',
					'src/app/styles/sass/functions/_exist.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/functions/_helper.sass',
					'src/app/styles/sass/functions/_helper.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/functions/_input.sass',
					'src/app/styles/sass/functions/_input.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/functions/_isset.sass',
					'src/app/styles/sass/functions/_isset.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/functions/_length.sass',
					'src/app/styles/sass/functions/_length.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/functions/_number.sass',
					'src/app/styles/sass/functions/_number.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/functions/_rem.sass',
					'src/app/styles/sass/functions/_rem.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/functions/_replace.sass',
					'src/app/styles/sass/functions/_replace.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/functions/_return.sass',
					'src/app/styles/sass/functions/_return.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/functions/_size.sass',
					'src/app/styles/sass/functions/_size.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/functions/_vendors.sass',
					'src/app/styles/sass/functions/_vendors.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/mixins/_animation.sass',
					'src/app/styles/sass/mixins/_animation.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/mixins/_arrow.sass',
					'src/app/styles/sass/mixins/_arrow.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/mixins/_basic.sass',
					'src/app/styles/sass/mixins/_basic.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/mixins/_before-after.sass',
					'src/app/styles/sass/mixins/_before-after.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/mixins/_border.sass',
					'src/app/styles/sass/mixins/_border.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/mixins/_border-radius.sass',
					'src/app/styles/sass/mixins/_border-radius.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/mixins/_filter.sass',
					'src/app/styles/sass/mixins/_filter.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/mixins/_flex.sass',
					'src/app/styles/sass/mixins/_flex.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/mixins/_image.sass',
					'src/app/styles/sass/mixins/_image.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/mixins/_margin_padding.sass',
					'src/app/styles/sass/mixins/_margin_padding.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/mixins/_position.sass',
					'src/app/styles/sass/mixins/_position.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/mixins/_prefix.sass',
					'src/app/styles/sass/mixins/_prefix.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/mixins/_text-shadow.sass',
					'src/app/styles/sass/mixins/_text-shadow.sass',
					templateData
				);
				this.copyTpl(
					'src/app/styles/sass/mixins/_typography.sass',
					'src/app/styles/sass/mixins/_typography.sass',
					templateData
				);
			} else {
				this.copyTpl(
					'src/app/main.scss',
					'src/app/main.scss',
					templateData
				);
				this.copyTpl(
					'src/app/pages/index.scss',
					'src/app/pages/index.scss',
					templateData
				);
				this.copyTpl(
					'src/app/pages/components/index.scss',
					'src/app/pages/components/index.scss',
					templateData
				);
				this.copyTpl(
					'src/app/pages/components/footer/footer.component.scss',
					'src/app/pages/components/footer/footer.component.scss',
					templateData
				);
				this.copyTpl(
					'src/app/pages/components/header/header.component.scss',
					'src/app/pages/components/header/header.component.scss',
					templateData
				);
				this.copyTpl(
					'src/app/pages/views/index.scss',
					'src/app/pages/views/index.scss',
					templateData
				);
				this.copyTpl(
					'src/app/pages/views/home/index.component.scss',
					'src/app/pages/views/home/index.component.scss',
					templateData
				);
				this.copyTpl(
					'src/app/shared/index.scss',
					'src/app/shared/index.scss',
					templateData
				);
				this.copyTpl(
					'src/app/components/index.scss',
					'src/app/components/index.scss',
					templateData
				);
				this.copyTpl(
					'src/app/components/button-primary/button-primarycomponent.scss',
					'src/app/components/button-primary/button-primarycomponent.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/base/breakpoint.scss',
					'src/app/styles/scss/base/breakpoint.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/base/colors.scss',
					'src/app/styles/scss/base/colors.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/base/fonts.scss',
					'src/app/styles/scss/base/fonts.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/base/global.scss',
					'src/app/styles/scss/base/global.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/base/typography.scss',
					'src/app/styles/scss/base/typography.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/mixins.scss',
					'src/app/styles/scss/mixins.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/functions/_array.scss',
					'src/app/styles/scss/functions/_array.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/functions/_colors.scss',
					'src/app/styles/scss/functions/_colors.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/functions/_complex.scss',
					'src/app/styles/scss/functions/_complex.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/functions/_exist.scss',
					'src/app/styles/scss/functions/_exist.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/functions/_helper.scss',
					'src/app/styles/scss/functions/_helper.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/functions/_input.scss',
					'src/app/styles/scss/functions/_input.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/functions/_isset.scss',
					'src/app/styles/scss/functions/_isset.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/functions/_length.scss',
					'src/app/styles/scss/functions/_length.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/functions/_number.scss',
					'src/app/styles/scss/functions/_number.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/functions/_rem.scss',
					'src/app/styles/scss/functions/_rem.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/functions/_replace.scss',
					'src/app/styles/scss/functions/_replace.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/functions/_return.scss',
					'src/app/styles/scss/functions/_return.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/functions/_size.scss',
					'src/app/styles/scss/functions/_size.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/functions/_vendors.scss',
					'src/app/styles/scss/functions/_vendors.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/mixins/_animation.scss',
					'src/app/styles/scss/mixins/_animation.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/mixins/_arrow.scss',
					'src/app/styles/scss/mixins/_arrow.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/mixins/_basic.scss',
					'src/app/styles/scss/mixins/_basic.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/mixins/_before-after.scss',
					'src/app/styles/scss/mixins/_before-after.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/mixins/_border.scss',
					'src/app/styles/scss/mixins/_border.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/mixins/_border-radius.scss',
					'src/app/styles/scss/mixins/_border-radius.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/mixins/_filter.scss',
					'src/app/styles/scss/mixins/_filter.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/mixins/_flex.scss',
					'src/app/styles/scss/mixins/_flex.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/mixins/_image.scss',
					'src/app/styles/scss/mixins/_image.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/mixins/_margin_padding.scss',
					'src/app/styles/scss/mixins/_margin_padding.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/mixins/_position.scss',
					'src/app/styles/scss/mixins/_position.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/mixins/_prefix.scss',
					'src/app/styles/scss/mixins/_prefix.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/mixins/_text-shadow.scss',
					'src/app/styles/scss/mixins/_text-shadow.scss',
					templateData
				);
				this.copyTpl(
					'src/app/styles/scss/mixins/_typography.scss',
					'src/app/styles/scss/mixins/_typography.scss',
					templateData
				);
			}
		}

		// Testing
		if (this.testFramework !== 'none') {
			this.copyTpl(
				'test/karma/karma.conf.js',
				'karma.conf.js',
				templateData
			);
			this.copyTpl(
				'src/app/pages/components/footer/footer.component.test.js',
				'src/app/pages/components/footer/tests/footer.component.test.js',
				templateData
			);
			this.copyTpl(
				'src/app/pages/components/header/header.component.test.js',
				'src/app/pages/components/header/tests/header.component.test.js',
				templateData
			);
			this.copyTpl(
				'src/app/pages/views/home/index.component.test.js',
				'src/app/pages/views/home/tests/index.component.test.js',
				templateData
			);
			this.copyTpl(
				'src/app/shared/components/button-primary/button-primary.component.test.js',
				'src/app/shared/components/button-primary/tests/button-primary.component.test.js',
				templateData
			);
		}

		// Install dependencies
		const hasYarn = commandExists('yarn');
		this.installDependencies({
			npm: !hasYarn,
			yarn: hasYarn,
			bower: false,
			skipInstall: this.options['skip-install']
		});

		this.on('end', () => {
			// Format files with prettier
			this.spawnCommand('npm', ['run', 'format']);
			this.log(
				'\n' +
					'Everything looks ready!'.blue +
					' Get started by running "' +
					'npm start'.green +
					'".\n'
			);
		});
	}
};
