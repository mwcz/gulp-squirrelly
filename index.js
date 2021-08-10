'use strict';
const PluginError = require('plugin-error');
const through = require('through2');
const sqrl = require('squirrelly');
const _ = require('lodash');

function compile(options = sqrl.defaultConfig, data, render) {
	return through.obj(function (file, encoding, callback) {
		if (file.isNull()) {
			callback(null, file);
			return;
		}

		if (file.isStream()) {
			callback(new PluginError('gulp-squirrelly', 'Streaming not supported'));
			return;
		}

		try {
			const tpl = sqrl.compile(file.contents.toString(), options);
			file.contents = Buffer.from(render ? tpl(_.merge({}, file.data, data), options) : tpl.toString());
			this.push(file);
		} catch (error) {
			this.emit('error', new PluginError('gulp-squirrelly', error.message, {fileName: file.path, showProperties: false, showStack: false}));
		}

		callback();
	});
}

module.exports = (data, options) => compile(options, data, true);
module.exports.precompile = options => compile(options);
