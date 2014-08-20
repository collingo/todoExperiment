var expect = require('chai').expect;

// SUT
var buildHtml = require('../src/buildHtml');

describe('BuildHtml', function() {

	describe('when called in error with', function() {

		describe('no parameters', function() {

			it('should throw an error with message', function() {
				expect(buildHtml).to.throw(Error, /Missing model and template/);
			});

		});

		describe('no template', function() {

			it('should throw an error with message', function() {
				expect(function() {
					buildHtml({});
				}).to.throw(Error, /Missing template/);
			});

		});

		describe('a non-string template', function() {

			it('should throw an error with message', function() {
				expect(function() {
					buildHtml({}, 123);
				}).to.throw(Error, /Template must be a string/);
			});

		});

	});

	describe('when called with', function() {

		describe('a simple model and string template', function() {

			it('should return the original template string', function(){
				var html = buildHtml({
					test: 'Hello'
				}, '<div></div>');
				expect(html).to.equal('<div></div>');
			});

		});

		describe('an empty model', function() {

			it('should return the original template string', function(){
				var html = buildHtml({}, '<div>{{test}}</div>');
				expect(html).to.equal('<div>{{test}}</div>');
			});

		});

		describe('a mismatching model', function() {

			it('should return the string with only matching placeholders replaced', function(){
				var html = buildHtml({
					match: 'matched',
					mismatch: 'not matched'
				}, '<div><div>{{match}}</div><div>{{matchAgain}}</div></div>');
				expect(html).to.equal('<div><div>matched</div><div>{{matchAgain}}</div></div>');
			});

		});

		describe('a template containing whitespace characters', function() {

			it('should strip the whitespace', function(){
				var html = buildHtml({
					one: 'ONE',
					two: 'TWO'
				}, '<div>\n\t<p>{{one}}<span>{{two}}</span></p>\n\t<input type="text" />\n</div>');
				expect(html).to.equal('<div><p>ONE<span>TWO</span></p><input type="text" /></div>');
			});

		});

	});

	describe('when the template has', function() {

		describe('plain html with value', function() {

			it('should return the original template untouched', function(){
				var html = buildHtml({
					test: 'Hello'
				}, '<div>test</div>');
				expect(html).to.equal('<div>test</div>');
			});

		});

		describe('a placeholder to match', function() {

			it('should return the populated template', function(){
				var html = buildHtml({
					test: 'Hello'
				}, '<div>{{test}}</div>');
				expect(html).to.equal('<div>Hello</div>');
			});

		});

		describe('multiple placeholders to match', function() {

			it('should return the populated template', function(){
				var html = buildHtml({
					one: 'ONE',
					two: 'TWO'
				}, '<div><p>{{one}}<span>{{two}}</span></p></div>');
				expect(html).to.equal('<div><p>ONE<span>TWO</span></p></div>');
			});

		});

		describe('a self closing element (input)', function() {

			it('should return the populated template', function(){
				var html = buildHtml({
					one: 'ONE',
					two: 'TWO'
				}, '<div><p>{{one}}<span>{{two}}</span></p><input type="text" /></div>');
				expect(html).to.equal('<div><p>ONE<span>TWO</span></p><input type="text" /></div>');
			});

		});

		describe('a placeholder in an attribute', function() {

			it('should populate the attribute', function(){
				var html = buildHtml({
					test: 'Hello',
					attr: "AttrContents"
				}, '<div class="{{attr}}">{{test}}</div>');
				expect(html).to.equal('<div class="AttrContents">Hello</div>');
			});

		});

		describe('a placeholder has a nested reference', function() {

			it('should populate the placeholder with the nested value', function(){
				var html = buildHtml({
					test: 'Hello',
					nested: {
						key: 'value'
					}
				}, '<div>{{nested.key}}</div>');
				expect(html).to.equal('<div>value</div>');
			});

		});

	});

	describe('when the template has repeats', function() {

		describe('as array of strings', function() {

			it('should loop over the values and output in template', function(){
				var html = buildHtml({
					test: 'Hello',
					repeat: [
						'value1',
						'value2',
						'value3'
					]
				}, '<ul repeat="repeat"><li>{{value}}</li></ul>');
				expect(html).to.equal('<ul repeat="repeat"><li>value1</li><li>value2</li><li>value3</li></ul>');
			});

		});

		describe('as array of objects', function() {

			it('should loop over the values and output in template', function(){
				var html = buildHtml({
					test: 'Hello',
					repeat: [{
						text: 'value1'
					}, {
						text: 'value2'
					}, {
						text: 'value3'
					}]
				}, '<ul repeat="repeat"><li>{{text}}</li></ul>');
				expect(html).to.equal('<ul repeat="repeat"><li>value1</li><li>value2</li><li>value3</li></ul>');
			});

		});

		describe('where the partial template has a self closing item', function() {

			it('should loop over the values and output in template', function(){
				var html = buildHtml({
					test: 'Hello',
					repeat: [{
						text: 'value1'
					}, {
						text: 'value2'
					}, {
						text: 'value3'
					}]
				}, '<ul repeat="repeat"><li><input /><div>{{text}}</div></li></ul>');
				expect(html).to.equal('<ul repeat="repeat"><li><input /><div>value1</div></li><li><input /><div>value2</div></li><li><input /><div>value3</div></li></ul>');
			});

		});

		describe('which is nested in the model', function() {

			it('should loop over the values and output in template', function(){
				var html = buildHtml({
					test: 'Hello',
					nest: {
						repeat: [{
							text: 'value1'
						}, {
							text: 'value2'
						}, {
							text: 'value3'
						}]
					}
				}, '<ul repeat="nest.repeat"><li><input /><div>{{text}}</div></li></ul>');
				expect(html).to.equal('<ul repeat="nest.repeat"><li><input /><div>value1</div></li><li><input /><div>value2</div></li><li><input /><div>value3</div></li></ul>');
			});

		});

		describe('containing a attributte placeholder', function() {

			it('should loop over the values and output in template', function(){
				var html = buildHtml({
					test: 'Hello',
					nest: {
						repeat: [{
							text: 'value1',
							class: 'class1'
						}, {
							text: 'value2',
							class: 'class2'
						}, {
							text: 'value3',
							class: 'class3'
						}]
					}
				}, '<ul repeat="nest.repeat"><li class="{{class}}"><div>{{text}}</div></li></ul>');
				expect(html).to.equal('<ul repeat="nest.repeat"><li class="class1"><div>value1</div></li><li class="class2"><div>value2</div></li><li class="class3"><div>value3</div></li></ul>');
			});

		});

	});

});