var expect = require('chai').expect;
var clone = require('../');

describe('When cloning', function() {
	
	describe('a string', function() {
		it('should return a matching string', function() {
			expect(clone('Hello world')).to.equal('Hello world');
		});
	});
	
	describe('a number', function() {
		it('should return a matching number', function() {
			expect(clone(3.14)).to.equal(3.14);
			expect(clone(-1)).to.equal(-1);
		});
	});
	
	describe('a boolean', function() {
		it('should return a matching boolean', function() {
			expect(clone(true)).to.equal(true);
			expect(clone(false)).to.equal(false);
		});
	});
	
	describe('NaN', function() {
		it('should return NaN', function() {
			expect(clone(NaN)).to.be.NaN;
		});
	});
	
	describe('Infinity', function() {
		it('should return Infinity', function() {
			expect(clone(Number.POSITIVE_INFINITY)).to.equal(Number.POSITIVE_INFINITY);
		});
	});
	
	describe('Negative Infinity', function() {
		it('should return Negative Infinity', function() {
			expect(clone(Number.NEGATIVE_INFINITY)).to.equal(Number.NEGATIVE_INFINITY);
		});
	});

	describe('null', function() {
		it('should return null', function() {
			expect(clone(null)).to.equal(null);
		});
	});
	
	describe('undefined', function() {
		it('should return undefined', function() {
			expect(clone(undefined)).to.equal(undefined);
		});
	});

	describe('a RegExp', function() {
		var expected;
		var actual;
		var hisName = 'Mr Plow, thats his name, that name again is Mr Plow'

		beforeEach(function() {
			expected = new RegExp("plow", "gi");
			actual = clone(expected);
		});

		it('should return a different RexExp Object', function() {
			expect(actual).to.not.equal(expected);
		});

		it('should match the same string', function() {
			expect(hisName.search(actual)).to.equal(hisName.search(expected));

			expectedMatch = hisName.match(expected);
			actualMatch = hisName.match(actual);
			
			expectedMatch.forEach(function(match, key) {
				expect(actualMatch[key]).to.equal(match);
			});
			
		});
	});

	describe('a date', function() {
		var expected;
		var actual;
		
		beforeEach(function() {
			expected = new Date('1997-08-29T00:00:00.000+1000');
			actual = clone(expected);
		});

		it('should return the same date', function() {
			expect(actual.getFullYear()).to.equal(expected.getFullYear());
			expect(actual.getMonth()).to.equal(expected.getMonth());
			expect(actual.getDate()).to.equal(expected.getDate());
		});

		it('should return the same time', function() {
			expect(actual.getTime()).to.equal(expected.getTime());
		});

		it('should return the same timezone', function() {
			expect(actual.getTimezoneOffset()).to.equal(expected.getTimezoneOffset());
		});
	});
	
	describe('an array', function() {
		it('should return a new array', function() {
			var a = [1, 2, 3];
			var b = clone(a);
			expect(b).to.not.equal(a);
		});
		
		function elementsShouldMatch(a, b) {
			for (var index = 0; index < a.length; index++) {
				var originalType = typeof a[index];
				var newType = typeof b[index];
				
				expect(newType).to.equal(originalType);
				expect(b[index]).to.equal(a[index]);
			}
		}
		
		describe('of numbers', function() {
			it('should return array of matching numbers', function() {
				var a = [1, 2, 3];
				var b = clone(a);
				expect(b).to.eql(a);
			});
			
			describe('containing NaN and Infinity', function() {
				it('should return array of NaN and Infinity', function() {
					var a = [NaN, Infinity];
					var b = clone(a);
					expect(b[0]).to.be.NaN;
					expect(b[1]).to.equal(Infinity);
				});
			});
		});
		
		describe('of strings', function() {
			it('should return array of matching strings', function() {
				var a = ['a', 'b', 'c'];
				var b = clone(a);
				expect(b).to.eql(a);
			});
		});
		
		describe('of booleans', function() {
			it('should return array of matching booleans', function() {
				var a = [true, false];
				var b = clone(a);
				expect(b).to.eql(a);
			});
		});
		
		describe('of Dates', function() {
			var a, b;
			
			beforeEach(function() {
				a = [new Date()];
				b = clone(a);
			});
			
			it('should return array containing new Date instances', function() {
				expect(b[0]).to.not.equal(a[0]);
			});
			
			it('should return array of matching Dates', function() {
				expect(b).to.eql(a);
			});
		});

		describe('of Regex', function() {
			var expected;
			var actual;
			var hisName = 'Mr Plow, thats his name, that name again is Mr Plow'

			beforeEach(function() {
				expected = [new RegExp("plow", "gi"), /mr/gi];
				actual = clone(expected);
			});

			it('should return array containing new RexExp instances', function() {
				for (var i=0; i<expected.length; i++) {
					expect(actual[i]).to.not.equal(expected[i]);
				}				
			});

			it('should return array of matching RegExp', function() {
				for (var i=0; i<expected.length; i++) {
					expect(hisName.search(actual[i])).to.equal(hisName.search(expected[i]));

					expectedMatch = hisName.match(expected[i]);					
					actualMatch = hisName.match(actual[i]);
					
					expectedMatch.forEach(function(match, key) {
						expect(actualMatch[key]).to.equal(match);
					});					
				}
			});
		})
	});
	
	describe('an object', function() {
		var a, b;
		
		beforeEach(function() {
			a = {
				text: 'Mr Plow, thats his name, that name again is Mr Plow',
				num: 3.14,
				day: new Date('1997-08-29T00:00:00.000Z'),
				yes: true,
				no: false,
				badNum: NaN,
				lots: Infinity,
				
				subObject: {
					text: 'Mr Plow, thats his name, that name again is Mr Plow',
					num: 3.14,
					day: new Date('1997-08-29T00:00:00.000Z'),
					yes: true,
					no: false,
					badNum: NaN,
					lots: Infinity
				},
				
				items: [
					'Mr Plow, thats his name, that name again is Mr Plow',
					3.14,
					new Date('1997-08-29T00:00:00.000Z'),
					true,
					false,
					NaN,
					Infinity,
					{
						text: 'Mr Plow, thats his name, that name again is Mr Plow',
						num: 3.14,
						day: new Date('1997-08-29T00:00:00.000Z'),
						yes: true,
						no: false,
						badNum: NaN,
						lots: Infinity
					},
					[
						'Yo dawg, I heard you like arrays',
						[
							'So we put an array',
							{ text: 'In your array' }
						]
					]
				]
			};
			
			b = clone(a);
		});
		
		it('should return a new object', function() {
			// Objects should be different instances
			expect(b).to.not.equal(a);
			expect(b.subObject).to.not.equal(a.subObject);
			expect(b.items).to.not.equal(a.items);
			expect(b.items[7]).to.not.equal(a.items[7]);
			expect(b.items[8][1][1]).to.not.equal(a.items[8][1][1]);
		});
		
		it('should have properties and sub-properties that match', function() {
			expect(b).to.eql(a);
		});
	});
});

