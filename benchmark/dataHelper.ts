var faker = require('faker');
var path = require('path');
var os = require('os');
var fs = require('fs');

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;

function randomPerson(options) {
	var opts = options || {};
	
	opts.maxDateOfBirth = opts.maxDateOfBirth || new Date(Date.now() - MS_IN_YEAR);
	opts.minAge = opts.minAge || 18;
	opts.maxAge = opts.maxAge || 105;
	opts.depth = opts.depth || 0;
	
	// Generates a family tree
	var result = {
		name: faker.name.lastName() + faker.name.firstName(),
		
		employment: {
			companyName: faker.company.companyName()  
		},
		regex: /a/g,
		age: faker.random.number(),
		dateOfBirth: faker.date.past(),
		enroledToVote: faker.random.boolean(),
	};
	
	if (opts.depth > 0) {
		result.parents = [
			randomPerson({ depth: opts.depth - 1 }),
			randomPerson({ depth: opts.depth - 1 })
		];
	}
	
	return result;
}

module.exports.randomPerson = randomPerson;

function getTempFileName() {
	return path.join(os.tmpdir(), Math.floor((Math.random() * 10000000)).toString() + '.yo.tmp');
}

module.exports.jsonSize = function(obj, callback) {
	var tempFileName = getTempFileName();
	var text = JSON.stringify(obj, null, '\t');
	
	fs.writeFile(tempFileName, text, { encoding: 'utf8' }, function(err) {
		fs.stat(tempFileName, function(err, stats) {
			fs.unlink(tempFileName, function() {
				callback(stats.size);
			});
		});
	});
}