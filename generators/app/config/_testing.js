module.exports = {
	files: [
		{
			src: "src/test/karma/karma.conf.js",
			dest: "karma.conf.js"
		},
		{
			src: "src/app/pages/components/footer/footer.component.test.js",
			dest:
				"src/app/pages/components/footer/tests/footer.component.test.js"
		},
		{
			src: "src/app/pages/components/header/header.component.test.js",
			dest:
				"src/app/pages/components/header/tests/header.component.test.js"
		},
		{
			src: "src/app/pages/views/home/index.component.test.js",
			dest: "src/app/pages/views/home/tests/index.component.test.js"
		},
		{
			src:
				"src/app/shared/components/button-primary/button-primary.component.test.js",
			dest:
				"src/app/shared/components/button-primary/tests/button-primary.component.test.js"
		}
	]
};
