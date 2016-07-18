<center>
	<img src="https://raw.githubusercontent.com/codeandcats/fast-clone/master/logo.png" />
</center>

The *fastest deep cloning* function on NPM that supports the following types:
- Objects (POJOs, null, undefined)
- Arrays
- Dates
- Regular Expressions
- Strings
- Numbers (NaN, Positive Intinity, Negative Intinity)
- Booleans

## Speed Comparison
Average runtime of various NPM clone libraries on a complex object loaded from a **1.64 MB** json file.

NPM Library      | Time
-----------------|----------
clone            |  716 ms
deepcopy         |  193 ms
snapshot         |  184 ms
lodash.cloneDeep |  120 ms
**fast-clone**   | **60 ms**

## Installation
```
npm install fast-clone --save
```

## Usage
Can be used in Node.js or you can use in Browser either using Browserfy/Webpack or the global clone function. 
```
var clone = require('fast-clone');

var a = {
	name: 'Natasha Rominov',
	age: 30,
	skills: [
		'Pistols',
		'Espionage'
	],
	dateOfBirth: new Date('1986-05-21T00:00:00.000Z')
};

var b = clone(a);

b.skills.push('That grabby thing she does with her legs');

console.log(a.skills)
console.log(b.skills);
```

Output will be:
```
['Pistols', 'Espionage']
['Pistols', 'Espionage', 'That grabby thing she does with her legs']
```

## Got an Issue or Feature Suggestion?
Then [create an issue on GitHub](https://github.com/codeandcats/fast-clone/issues) and I'll fix/add it asap. :)

Or fork the repo and shoot me a pull request
