'use strict';
/* eslint-env mocha */
const {strict: assert} = require('assert');
const Vinyl = require('vinyl');
const data = require('gulp-data');
const sqrl = require('squirrelly');
const template = require('.');

it('should compile Squirerlly templates', callback => {
	const stream = template({people: ['foo', 'bar']}, sqrl.getConfig({tags: ['<%', '%>']}));

	stream.on('data', data => {
		assert.equal(data.contents.toString(), '<li>foo</li><li>bar</li>');
	});

	stream.on('end', callback);

	stream.write(new Vinyl({
		contents: Buffer.from('<% @each(it.people) => name %><li><% name %></li><% /each %>')
	}));

	stream.end();
});

it('should merge gulp-data and data parameter', callback => {
	const stream = data(() => {
		return {
			people: ['foo', 'bar'],
			nested: {
				a: 'one',
				b: 'two'
			}
		};
	});

	stream.pipe(template({
		heading: 'people',
		nested: {
			a: 'three',
			c: 'four'
		}
	}));

	stream.on('data', data => {
		assert.equal(data.contents.toString(), '<h1>people</h1><li>foo</li><li>bar</li>three,two,four');
	});

	stream.on('end', callback);

	stream.write(new Vinyl({
		contents: Buffer.from('<h1>{{ it.heading }}</h1>{{ @each(it.people) => name }}<li>{{ name }}</li>{{ /each }}{{ it.nested.a }},{{ it.nested.b }},{{ it.nested.c }}')
	}));

	stream.end();
});

it('should not alter gulp-data or data parameter', callback => {
	const chunks = [];

	const stream = data(file => {
		return {
			contents: file.contents.toString()
		};
	});

	const parameter = {
		foo: 'foo',
		bar: 'bar',
		foobar: ['foo', 'bar']
	};

	stream.pipe(template(parameter));

	stream.on('data', chunk => {
		chunks.push(chunk);
	});

	stream.on('end', () => {
		assert.deepEqual(chunks[0].data, {contents: 'foo'});
		assert.deepEqual(parameter, {
			foo: 'foo',
			bar: 'bar',
			foobar: ['foo', 'bar']
		});
		callback();
	});

	stream.write(new Vinyl({
		contents: Buffer.from('foo')
	}));

	stream.end();
});

it('should work with no data supplied', callback => {
	const stream = template();

	stream.on('data', data => {
		assert.equal(data.contents.toString(), '');
	});

	stream.on('end', callback);

	stream.write(new Vinyl({
		contents: Buffer.from('')
	}));

	stream.end();
});

it('should precompile Squirrelly templates', callback => {
	const stream = template.precompile();

	stream.on('data', data => {
		assert.ok(data.contents.toString().includes('function'));
	});

	stream.on('end', callback);

	stream.write(new Vinyl({
		contents: Buffer.from('<h1><%= heading %></h1>')
	}));

	stream.end();
});

it('should support Squirrelly options when precompiling', callback => {
	const options = {
		useWith: true
	};

	const stream = template.precompile(options);

	stream.on('data', data => {
		assert.ok(data.contents.toString().includes('function'));
	});

	stream.on('end', callback);

	stream.write(new Vinyl({
		contents: Buffer.from('<h1>{{ heading }}</h1>')
	}));

	stream.end();
});
