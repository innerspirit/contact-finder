#!/usr/bin/env node
let finder = require('./contactfinder.js');
let urlparam = process.argv.slice(2);

for (let i in urlparam) {
	finder(urlparam[i]).then(logger.bind(urlparam[i]));
}

function logger(res) {
	if (res !== undefined) {
		console.log(res);
	} else {
		console.log("Wrong URL.")
	}
}