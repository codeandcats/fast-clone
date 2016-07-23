var dataHelper = require('./dataHelper');
var filesize = require('filesize');
var chalk = require('chalk');
var pad = require('pad');
var numeral = require('numeral');
var benv = require('benv');

benv.setup(function() {

	benv.expose({
		//$: benv.require('./node_modules/zepto/zepto.js', 'Zepto'),
		angular: benv.require('../node_modules/angular/angular.js', 'angular')
	});

	// Various cloning libraries
	var libs = {
		clone: require('clone'),
		deepClone: require('deepclone'),
		'lodash.cloneDeep': require('lodash').cloneDeep,
		snapshot: (function(snapshot) {
			return function(data) {
				var expr = snapshot(data);
				return eval(expr);
			};
		})(require('snapshot')),
		'fast-clone': require('../'),
		'angular.copy': angular.copy
	};

	console.log('Generating random json data...');

	var data = dataHelper.randomPerson({ depth: 11 });

	console.log('Done.');
	console.log('');

	dataHelper.jsonSize(data, function(size) {
		console.log('Test data size is: ', filesize(size));
		console.log('');
		
		runBenchmarks(libs);
	});

	function runBenchmarks(libs) {
		var names = Object.getOwnPropertyNames(libs);
		
		var results = [];
		
		names.forEach(function(name, index) {
			var text = 'Running benchmark ' + (index + 1) + ' of ' + names.length + '...';
			
			process.stdout.write(text + '\r');
			
			var clone = libs[name];
			
			var startTime = Date.now();
			var maxDuration = 2000;
			var maxTime = startTime + maxDuration;
			var endTime = maxTime;
			var iterations = 0;
			
			while (Date.now() < maxTime) {
				var copy = clone(data);
				iterations++;
				endTime = Date.now();
			}
			
			var avgTime = Math.round((endTime - startTime) / iterations);
			
			results.push({
				name: name,
				time: avgTime 
			});
			
			console.log(text + ' Done');
		});
		
		console.log('');
		
		// Sort by time desc
		results.sort(function(a, b) {
			return b.time - a.time;
		});
		
		// Change results to array of values and format time
		results = results.map(function(item) {
			return [
				item.name,
				numeral(item.time).format('0,0') + ' ms'
			];
		});
		
		var columnTitles = ['Library', 'Time']
		
		// Get max column lengths so we can pad them nicely
		var columnLengths = results.reduce(function(prev, curr) {
			return [
				Math.max(prev[0], curr[0].length),
				Math.max(prev[1], curr[1].length)
			];
		}, [columnTitles[0].length, columnTitles[1].length]);
		
		// Print the results
		console.log(
			pad(columnTitles[0], columnLengths[0]) + 
			' | ' +
			pad(columnTitles[1], columnLengths[1]));
		
		console.log(
			pad('', columnLengths[0], '-') +
			'-|-' + 
			pad('', columnLengths[1], '-'));
		
		results.forEach(function(result, index) {
			var color = index == names.length - 1 ? chalk.green : chalk.reset;
			console.log(
				color(pad(result[0], columnLengths[0])) + 
				' | ' +
				color(pad(columnLengths[1], result[1])));
		});

		console.log('');
	}

});
