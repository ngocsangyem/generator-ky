<% if (testFramework === 'mocha' || testFramework === 'jasmine') { %>
import path from 'path';<% } %>
import gulp from 'gulp';
import glob from 'glob';
import { KarmaServer, args } from './gulp/utils';

glob.sync('./gulp/tasks/**/*.js')
	.filter(function(file) {
		return /\.(js)$/i.test(file);
	})
	.map(function(file) {
		require(file);
	});

gulp.task(
	'serve',
	gulp.series([
		'clean',<% if (htmlOption === 'pug') { %>
		'pug:data',<% } %>
		gulp.parallel(<% if (cssOption === 'sass') { %>
			'sass',<% } if (htmlOption === 'pug') { %>
			'pug',<% } %>
			'browserify',
			'fonts',
			'images',
			'concatCss',
			'concatJs'
		),
		'browserSync'
	])
);

gulp.task(
	'build',
	gulp.series([
		'clean',
		gulp.parallel(<% if (htmlOption === 'pug') { %>
			'pug',<% } if (cssOption === 'sass') { %>
			'sass',<% } %>
			'fonts',
			'images',
			'concatCss',
			'concatJs',
			'browserify'
		),
		'zip',
		'rev',
		'sitemap',
		'size',
		'done'
	])
);

gulp.task(
	'component',
	gulp.series([
		'clean',
		gulp.parallel(<% if (htmlOption === 'pug') { %>
			'pug',<% } if (cssOption === 'sass') { %>
			'sass',<% } %>
			'fonts',
			'images',
			'concatCss',
			'concatJs',
			'browserify'
		),
		gulp.parallel(<% if (cssOption === 'sass') { %>'componentSASS', <% } if (htmlOption === 'pug') { %>'componentPUG', <% } %>'componentSCRIPT'),
		'zip',
		'rev',
		'sitemap',
		'size',
		'done'
	])
);

// Default task
// gulp.task('default', gulp.series('clean', 'build'));

// Testing
// Testing
gulp.task('test', gulp.series('eslint'<% if (testFramework === 'none') { %>));<% } else { %>, (done) => {
	new KarmaServer({
	  configFile: path.join(__dirname, '/karma.conf.js'),
	  singleRun: !args.watch,
	  autoWatch: args.watch
	}, done).start();
  }));<% } %>
