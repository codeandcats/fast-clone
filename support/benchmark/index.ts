import * as filesize from 'filesize';
import chalk from 'chalk';
import pad = require('pad');
import * as numeral from 'numeral';
import * as benv from 'benv';
import { rootPath } from 'get-root-path';
import { getJsonSize, getRandomPerson } from './dataHelper';
import * as path from 'path';

declare const angular: { copy: <T>(value: T) => T };

benv.setup(function () {
  benv.expose({
    angular: benv.require(path.join(rootPath, './node_modules/angular/angular.js'), 'angular')
  });

  // Various cloning libraries
  const libs = {
    clone: require('clone'),
    deepClone: require('deepclone'),
    'lodash.cloneDeep': require('lodash').cloneDeep,
    snapshot: (function (snapshot) {
      return (data: any) => {
        const expr = snapshot(data);
        return eval(expr);
      };
    })(require('snapshot')),
    'fast-clone': require(path.join(rootPath, './dist/index.js')),
    'angular.copy': angular.copy
  };

  console.log('Generating random json data...');

  const data = getRandomPerson({ depth: 13 });

  console.log('Done.');
  console.log('');

  getJsonSize(data, function (size: number) {
    console.log('Test data size is: ', filesize(size));
    console.log('');

    runBenchmarks(libs);
  });

  function runBenchmarks(libs: any) {
    const names = Object.getOwnPropertyNames(libs);

    let results: { name: string, time: number }[] = [];

    names.forEach(function (name, index) {
      const text = 'Running benchmark ' + (index + 1) + ' of ' + names.length + '...';

      process.stdout.write(text + '\r');

      const clone = libs[name];

      const startTime = Date.now();
      const maxDuration = 2000;
      const maxTime = startTime + maxDuration;
      let endTime = maxTime;
      let iterations = 0;

      while (Date.now() < maxTime) {
        const copy = clone(data);
        iterations++;
        endTime = Date.now();
      }

      const avgTime = Math.round((endTime - startTime) / iterations);

      results.push({
        name: name,
        time: avgTime
      });

      console.log(text + ' Done');
    });

    console.log('');

    // Sort by time desc
    results.sort((a, b) => b.time - a.time);

    // Get array of values and format time
    const rows = results.map((item) => {
      return [
        item.name,
        numeral(item.time).format('0,0') + ' ms'
      ];
    });

    const columnTitles = ['Library', 'Time'];

    // Get max column lengths so we can pad them nicely
    const columnLengths = rows.reduce((prev, curr) => {
      return [
        Math.max(prev[0], curr[0].length),
        Math.max(prev[1], curr[1].length)
      ];
    }, [columnTitles[0].length, columnTitles[1].length]);

    // Print the rows
    console.log(
      pad(columnTitles[0], columnLengths[0]) +
      ' | ' +
      pad(columnTitles[1], columnLengths[1])
    );

    console.log(
      pad('', columnLengths[0], '-') +
      '-|-' +
      pad('', columnLengths[1], '-')
    );

    rows.forEach((row, index) => {
      const color = index == names.length - 1 ? chalk.green : chalk.reset;
      console.log(
        color(pad(row[0], columnLengths[0])) +
        ' | ' +
        color(pad(columnLengths[1], row[1])));
    });

    console.log('');
  }

});
