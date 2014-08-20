var expect = require('chai').expect;
var sinon = require('sinon');
var jsdom = require('jsdom').jsdom;
var jquery = require('fs').readFileSync('node_modules/jquery/dist/jquery.js', 'utf-8');
var jsdoc = jsdom('<html><head><script>'+jquery+'</script></head><body></body></html>');
var window = jsdoc.createWindow();
var $ = window.jQuery;
var proxyquire = require('proxyquire');

// SUT
var buildDom = require('../src/buildDom');

// helpers
var getHtml = function(dom) {
	return $('<div>').append($(dom).clone()).html();
};

describe('BuildDom', function() {

	describe('when called without parameters', function() {

		it('should throw an error with message', function() {
			expect(function() {
				buildDom();
			}).to.throw(Error, /Missing model and template/);
		});

	});

	describe('when missing tpl parameter', function() {

		it('should throw an error with message', function() {
			expect(function() {
				buildDom({});
			}).to.throw(Error, /Missing template/);
		});

	});

	describe('when passed a model and template', function() {

		var mod;
		var tpl;
		var dom;
		var mocks;
		var buildHtmlResponse = '<div>BindMe</div>';
		var stitchDomResponse = '<div>Bound</div>';

		beforeEach(function() {
			mod = {
				test: "BindMe"
			};
			tpl = '<div>{{test}}</div>';

			mocks = {
				buildHtml: function() {
					return buildHtmlResponse;
				},
				stitchDom: function() {
					return stitchDomResponse;
				}
			};
			buildHtmlSpy = sinon.spy(mocks, 'buildHtml');
			stitchDomSpy = sinon.spy(mocks, 'stitchDom');
			buildDom = proxyquire('../src/buildDom', {
				'./buildHtml': mocks.buildHtml,
				'./stitchDom': mocks.stitchDom
			});
			dom = buildDom(mod, tpl, window.document);
		});

		it('should call buildHtml dependency once', function() {
			expect(buildHtmlSpy.calledOnce).to.equal(true);
		});

		it('should call buildHtml dependency with correct argument count', function() {
			expect(buildHtmlSpy.getCall(0).args.length).to.equal(2);
		});

		it('should call buildHtml dependency with model', function() {
			expect(buildHtmlSpy.getCall(0).args[0]).to.equal(mod);
		});

		it('should call buildHtml dependency with template', function() {
			expect(buildHtmlSpy.getCall(0).args[1]).to.equal(tpl);
		});

		it('should call stitchDom dependency once', function() {
			expect(stitchDomSpy.calledOnce).to.equal(true);
		});

		it('should call stitchDom dependency with correct argument count', function() {
			expect(stitchDomSpy.getCall(0).args.length).to.equal(3);
		});

		it('should call stitchDom dependency with model', function() {
			expect(stitchDomSpy.getCall(0).args[0]).to.equal(mod);
		});

		it('should call stitchDom dependency with template', function() {
			expect(stitchDomSpy.getCall(0).args[1]).to.equal(tpl);
		});

		it('should call stitchDom dependency with dom', function() {
			expect(!!stitchDomSpy.getCall(0).args[2].nodeName).to.equal(true);
		});

		it('should call stitchDom dependency with dom made from the output of buildHtml', function() {
			var actualDom = stitchDomSpy.getCall(0).args[2];
			expect(getHtml(actualDom)).to.equal(buildHtmlResponse);
		});

		it('should return the result of stitchDom', function() {
			expect(dom).to.equal(stitchDomResponse);
		});

	});

});
