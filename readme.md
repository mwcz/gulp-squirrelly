# gulp-squirrelly

> Render/precompile [Squirrelly templates](https://squirrelly.js.org/)

This package is a near-identical clone of [gulp-template](https://github.com/sindresorhus/gulp-template) by sindresorhus, just with Squirrelly subbed in for lodash.template.  It was thrown together quickly so please open an issue or PR if you find anything that isn't quite right.

## Install

```
$ npm install --save-dev gulp-squirrelly
```


## Usage

### `src/greeting.html`

```erb
<h1>Hello {{ name }}</h1>
```

### `gulpfile.js`

```js
const gulp = require('gulp');
const template = require('gulp-squirrelly);

exports.default = () => (
	gulp.src('src/greeting.html')
		.pipe(template({name: 'Sindre'}))
		.pipe(gulp.dest('dist'))
);
```

You can alternatively use [gulp-data](https://github.com/colynb/gulp-data) to inject the data:

```js
const gulp = require('gulp');
const template = require('gulp-squirrelly');
const data = require('gulp-data');

exports.default = () => (
	gulp.src('src/greeting.html')
		.pipe(data(() => ({name: 'Sindre'})))
		.pipe(template())
		.pipe(gulp.dest('dist'))
);
```

### `dist/greeting.html`

```html
<h1>Hello Sindre</h1>
```


## API

### template(data, options?)

Render a template using the provided `data`.

### template.precompile(options?)

Precompile a template for rendering dynamically at a later time.

#### data

Type: `object`

Data object used to populate the text.

#### options

Type: `object`

[Squirrelly configuration](https://squirrelly.js.org/docs/api/configuration).  Defaults to `Sqrl.defaultConfig`.


## Tip

You can also provide your own interpolation strings ([see "tags" here](https://squirrelly.js.org/docs/api/configuration)) for custom templates.

### `src/greeting.html`

```html
<h1>Hello <% name %></h1>
```

### `gulpfile.js`

```js
const gulp = require('gulp');
const template = require('gulp-squirrelly');
const data = require('gulp-data');
const Sqrl = require('squirrelly');

exports.default = () => (
	gulp.src('src/greeting.html')
		.pipe(template(
			{ name: "Sindre" },
			Sqrl.getConfig({ tags: ["<%", "%>"] })
		))
		.pipe(gulp.dest('dist'))
);
```

Note: `Sqrl.getConfig` merges the object you provide into Squirrelly's default configuration.

### `dist/greeting.html`

```html
<h1>Hello Sindre</h1>
```


## Related

- [grunt-template](https://github.com/mathiasbynens/grunt-template) - Grunt version
