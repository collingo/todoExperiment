var expect = require('chai').expect;
var sinon = require('sinon');
var jsdom = require('jsdom').jsdom;
var jquery = require('fs').readFileSync('node_modules/jquery/dist/jquery.js', 'utf-8');
var doc = jsdom('<html><head><script>'+jquery+'</script></head><body></body></html>');
var $ = doc.createWindow().jQuery;
var proxyquire =  require('proxyquire');

// SUT
var stitch = require('../src/stitch');

describe('Stitch', function() {

	describe('when called without parameters', function() {

		it('should throw an error with message', function() {
			expect(function() {
				stitch();
			}).to.throw(Error, /Missing model and template/);
		});

	});

	describe('when missing tpl parameter', function() {

		it('should throw an error with message', function() {
			expect(function() {
				stitch({});
			}).to.throw(Error, /Missing template/);
		});

	});

	describe('when passed a model and template', function() {

		var mod = {
			test: "BindMe"
		};
		var tpl = '<div>{{test}}</div>';
		var html;
		var mocks;
		var buildHtmlResponse = 'BlahBlahBlah';

		beforeEach(function() {
			mocks = {
				buildHtml: function() {
					return buildHtmlResponse;
				}
			};
			buildHtmlSpy = sinon.spy(mocks, 'buildHtml');
			stitch = proxyquire('../src/stitch', {
				'./buildHtml': mocks.buildHtml
			});
			html = stitch(mod, tpl);
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

		it('should return the result of buildHtml', function() {
			expect(html).to.equal(buildHtmlResponse);
		});

	});

	describe('when passed a model, template and dom', function() {

		var mod;
		var tpl = '<div>{{test}}</div>';
		var dom;
		var mocks;
		var stitchDomResponse = 'BlahBlahBlah';
		var stitched;

		beforeEach(function() {
			mod = {
				test: "BindMe"
			};
			dom = $('<div>BindMe</div>')[0];
			mocks = {
				stitchDom: function() {
					return stitchDomResponse;
				}
			};
			stitchDomSpy = sinon.spy(mocks, 'stitchDom');
			stitch = proxyquire('../src/stitch', {
				'./stitchDom': mocks.stitchDom
			});
			stitched = stitch(mod, tpl, dom);
		});

		it('should call stitchDom dependency once', function() {
			expect(stitchDomSpy.calledOnce).to.equal(true);
		});

		it('should call buildHtml dependency with correct argument count', function() {
			expect(stitchDomSpy.getCall(0).args.length).to.equal(3);
		});

		it('should call stitchDom dependency with model', function() {
			expect(stitchDomSpy.getCall(0).args[0]).to.equal(mod);
		});

		it('should call stitchDom dependency with template', function() {
			expect(stitchDomSpy.getCall(0).args[1]).to.equal(tpl);
		});

		it('should call stitchDom dependency with some dom', function() {
			expect(stitchDomSpy.getCall(0).args[2]).to.equal(dom);
		});

		it('should return the result of stitchDom', function() {
			expect(stitched).to.equal(stitchDomResponse);
		});

	});

});
