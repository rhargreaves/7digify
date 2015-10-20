var config = require('../config');
var expect = require('chai').expect;

describe('config()', function() {
	describe('sevenDigitalConsumerKey', function() {
		it("should return correct value", function() {
			expect(config().sevenDigitalConsumerKey).to.equal('CONSUMER_KEY_HERE');
		});
	});

	describe('sevenDigitalConsumerSecret', function() {
		it("should return correct value", function() {
			expect(config().sevenDigitalConsumerSecret).to.equal('CONSUMER_SECRET_HERE');
		});
	});
});
