var expect = require('chai').expect;

// SUT
var templateToArray = require('../src/templateToArray');

// helpers
var result;
var processTpl = function(tpl) {
	result = templateToArray(tpl);
};
var expectLength = function(length) {
	expect(result.length).to.equal(length);
};
var expectItems = function(items) {
	for (var i = 0; i < result.length; i++) {
		expect(result[i].type).to.equal(items[i].type);
	}
};

describe('TemplateToArray', function() {

	describe('when called', function() {

		it('should always return an array', function() {
			expect(templateToArray()).to.be.instanceof(Array);
		});

		describe('with no template', function() {

			it('should return an empty array', function() {
				expect(templateToArray()).to.have.property('length', 0);
			});

		});

	});

	describe('when template contains', function() {

		describe('a single element', function() {

			it('should return an array with correct number of items', function() {
				expect(templateToArray('<div></div>')).to.have.property('length', 2);
			});

			it('should return an array containing object equivalients for each element', function() {
				expect(templateToArray('<div></div>')[0].type).to.equal('div');
				expect(templateToArray('<div></div>')[0].close).to.equal(undefined);
				expect(templateToArray('<div></div>')[1].type).to.equal('div');
				expect(templateToArray('<div></div>')[1].close).to.equal(true);
				expect(templateToArray('<p></p>')[0].type).to.equal('p');
			});

		});

		describe('a tagName containing a number', function() {

			var tpl = '<h1></h1>';

			it('should return an array with correct number of items', function() {
				expect(templateToArray(tpl)).to.have.property('length', 2);
			});

			it('should return an array containing object equivalients for each element', function() {
				expect(templateToArray(tpl)[0].type).to.equal('h1');
				expect(templateToArray(tpl)[0].close).to.equal(undefined);
				expect(templateToArray(tpl)[1].type).to.equal('h1');
				expect(templateToArray(tpl)[1].close).to.equal(true);
			});

		});

		describe('an element containing a text node', function() {

			var tpl = '<label>Hello</label>';

			it('should return an array with correct number of items', function() {
				expect(templateToArray(tpl)).to.have.property('length', 3);
			});

			it('should return an array containing object equivalients for each element', function() {
				expect(templateToArray(tpl)[0].type).to.equal('label');
				expect(templateToArray(tpl)[0].close).to.equal(undefined);
				expect(templateToArray(tpl)[1].type).to.equal('#text');
				expect(templateToArray(tpl)[1].value).to.equal('Hello');
				expect(templateToArray(tpl)[2].type).to.equal('label');
				expect(templateToArray(tpl)[2].close).to.equal(true);
			});

		});

		describe('two sibling elements', function() {

			beforeEach(function() {
				processTpl('<div></div><p></p>');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(4);
			});

			it('should return an array containing object equivalients for each element', function() {
				expectItems([{
					type: 'div'
				}, {
					type: 'div',
					close: true
				}, {
					type: 'p'
				}, {
					type: 'p',
					close: true
				}]);
			});

		});

		describe('one element nested inside another', function() {

			beforeEach(function() {
				processTpl('<div><p></p></div>');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(4);
			});

			it('should return an array containing object equivalients for each element', function() {
				expectItems([{
					type: 'div'
				}, {
					type: 'p'
				}, {
					type: 'p',
					close: true
				}, {
					type: 'div',
					close: true
				}]);
			});

		});

		describe('sibling nested elements', function() {

			beforeEach(function() {
				processTpl('<div><p></p></div><a><span></span></a>');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(8);
			});

			it('should return an array containing object equivalients for each element', function() {
				expectItems([{
					type: 'div'
				}, {
					type: 'p'
				}, {
					type: 'p',
					close: true
				}, {
					type: 'div',
					close: true
				}, {
					type: 'a'
				}, {
					type: 'span'
				}, {
					type: 'span',
					close: true
				}, {
					type: 'a',
					close: true
				}]);
			});

		});

		describe('self closing elements', function() {

			beforeEach(function() {
				processTpl('<input />');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(1);
			});

			it('should return an array containing object equivalients for each element', function() {
				expect(result[0].type).to.equal('input');
				expect(result[0].self).to.equal(true);
			});

		});

		describe('sibling self closing elements', function() {

			beforeEach(function() {
				processTpl('<input /><img />');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(2);
			});

			it('should return an array containing object equivalients for each element', function() {
				expectItems([{
					type: 'input'
				}, {
					type: 'img'
				}]);
			});

		});

		describe('an element with an attribute', function() {

			beforeEach(function() {
				processTpl('<div class="test"></div>');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(2);
			});

			describe('returns an array of objects where each', function() {

				it('should have correct type', function() {
					expect(result[0].type).to.equal('div');
				});

				it('should contain an attributes hash', function() {
					expect(typeof result[0].attributes).to.equal("object");
				});

				it('should contain an attributes hash of correct length', function() {
					expect(Object.keys(result[0].attributes).length).to.equal(1);
				});

				it('should contain an attributes hash which stores the attributes as key value pairs', function() {
					expect(result[0].attributes.class).to.equal("test");
				});

			});

		});

		describe('an element with an attribute containing a number', function() {

			beforeEach(function() {
				processTpl('<div id="1"></div>');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(2);
			});

			describe('returns an array of objects where each', function() {

				it('should contain an attributes hash of correct length', function() {
					expect(Object.keys(result[0].attributes).length).to.equal(1);
				});

				it('should contain an attributes hash which stores the attributes as key value pairs', function() {
					expect(result[0].attributes.id).to.equal("1");
				});

			});

		});

		describe('an element with an attribute containing a placeholder', function() {

			beforeEach(function() {
				processTpl('<div show="{{place}}"></div>');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(2);
			});

			describe('returns an array of objects where each', function() {

				it('should contain an attributes hash of correct length', function() {
					expect(Object.keys(result[0].attributes).length).to.equal(1);
				});

				it('should contain an attributes hash which stores objects for each placeholder attribute', function() {
					expect(result[0].attributes.show.type).to.equal('>');
					expect(result[0].attributes.show.bind).to.equal('place');
				});

			});

		});

		describe('an element with an attribute containing a nested placeholder', function() {

			beforeEach(function() {
				processTpl('<div show="{{place.here}}"></div>');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(2);
			});

			describe('returns an array of objects where each', function() {

				it('should contain an attributes hash of correct length', function() {
					expect(Object.keys(result[0].attributes).length).to.equal(1);
				});

				it('should contain an attributes hash which stores objects for each placeholder attribute', function() {
					expect(result[0].attributes.show.type).to.equal('>');
					expect(result[0].attributes.show.bind).to.equal('place.here');
				});

			});

		});

		describe('an element with an attribute containing a nested non-placeholder reference', function() {

			beforeEach(function() {
				processTpl('<div show="place.here"></div>');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(2);
			});

			describe('returns an array of objects where each', function() {

				it('should contain an attributes hash of correct length', function() {
					expect(Object.keys(result[0].attributes).length).to.equal(1);
				});

				it('should contain an attributes hash which stores objects for each placeholder attribute', function() {
					expect(result[0].attributes.show).to.equal('place.here');
				});

			});

		});

		describe('an element with multiple classes', function() {

			beforeEach(function() {
				processTpl('<div class="test another hello"></div>');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(2);
			});

			describe('returns an array of objects where each', function() {

				it('should contain an attributes hash of correct length', function() {
					expect(Object.keys(result[0].attributes).length).to.equal(1);
				});

				it('should contain an attributes hash which stores the attributes as key value pairs', function() {
					expect(result[0].attributes.class).to.equal("test another hello");
				});

			});

		});

		describe('an element with multiple attributes', function() {

			beforeEach(function() {
				processTpl('<div class="test" attribute="hello"></div>');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(2);
			});

			describe('returns an array of objects where each', function() {

				it('should have correct type', function() {
					expect(result[0].type).to.equal('div');
				});

				it('should contain an attributes hash', function() {
					expect(typeof result[0].attributes).to.equal("object");
				});

				it('should contain an attributes hash of correct length', function() {
					expect(Object.keys(result[0].attributes).length).to.equal(2);
				});

				it('should contain an attributes hash which stores the attributes as key value pairs', function() {
					expect(result[0].attributes.class).to.equal("test");
					expect(result[0].attributes.attribute).to.equal("hello");
				});

			});

		});

		describe('one placeholder', function() {

			beforeEach(function() {
				processTpl('<div>{{test}}</div>');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(3);
			});

			it('should return an array containing object equivalients for each element', function() {
				expectItems([{
					type: 'div'
				}, {
					type: '>',
					bind: 'test'
				}, {
					type: 'div',
					close: true
				}]);
			});

		});

		describe('a placeholder with capitals', function() {

			beforeEach(function() {
				processTpl('<div>{{testCapitals}}</div>');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(3);
			});

			it('should return an array containing object equivalients for each element', function() {
				expectItems([{
					type: 'div'
				}, {
					type: '>',
					bind: 'testCapitals'
				}, {
					type: 'div',
					close: true
				}]);
			});

		});

		describe('multiple placeholders', function() {

			beforeEach(function() {
				processTpl('<div>{{test}}</div><div>{{test}}<div>{{test}}</div></div>');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(9);
			});

			it('should return an array containing object equivalients for each element', function() {
				expectItems([{
					type: 'div'
				}, {
					type: '>',
					bind: 'test'
				}, {
					type: 'div',
					close: true
				},{
					type: 'div'
				}, {
					type: '>',
					bind: 'test'
				},{
					type: 'div'
				}, {
					type: '>',
					bind: 'test'
				}, {
					type: 'div',
					close: true
				}, {
					type: 'div',
					close: true
				}]);
			});

		});

		describe('a nested placeholder', function() {

			beforeEach(function() {
				processTpl('<div>{{test.nested}}</div>');
			});

			it('should return an array of length matching the number of elements', function() {
				expectLength(3);
			});

			it('should return an array containing object equivalients for each element', function() {
				expectItems([{
					type: 'div'
				}, {
					type: '>',
					bind: 'test.nested'
				}, {
					type: 'div',
					close: true
				}]);
			});

		});

	});

});