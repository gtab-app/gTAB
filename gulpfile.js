var gulp = require('gulp');
var del = require('del');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var cssSlam = require('css-slam').gulp;
var htmlMinifier = require('gulp-html-minifier');
var HtmlSplitter = require('polymer-build').HtmlSplitter;
var mergeStream = require('merge-stream');

var PolymerProject = require('polymer-build').PolymerProject;

var project = new PolymerProject(require('./polymer.json'));

gulp.task('clean', function() {
	return del(['build']);
});

gulp.task('build', ['clean'], function() {
	var sourcesHtmlSplitter = new HtmlSplitter();

	var sources = project.sources()
		.pipe(sourcesHtmlSplitter.split())
		.pipe(gulpif(/\.js$/, uglify()))
		.pipe(gulpif(/\.css$/, cssSlam()))
		.pipe(gulpif(/\.html$/, htmlMinifier({collapseWhitespace: true, removeComments: true,})))
		.pipe(sourcesHtmlSplitter.rejoin());

	var dependencies= project.dependencies()
		.pipe(sourcesHtmlSplitter.split())
		.pipe(gulpif(/\.js$/, uglify()))
		.pipe(gulpif(/\.css$/, cssSlam()))
		.pipe(gulpif(/\.html$/, htmlMinifier({collapseWhitespace: true, removeComments: true,})))
		.pipe(sourcesHtmlSplitter.rejoin());

	return mergeStream(sources, dependencies)
		.pipe(project.bundler())
		.pipe(gulp.dest('build/'));
});