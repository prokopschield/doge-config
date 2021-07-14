const { read } = require('doge-json');
const { getConfig } = require('..');

module.exports = () => {
	const foo = getConfig('at');
	foo.obj.foo = ['one', 'two', 'three'];
	foo.obj.foo.array.push('fizz', 'buzz');

	if (
		JSON.stringify(read('config/at.json')) !==
		`{"foo":["one","two","three","fizz","buzz"]}`
	) {
		console.log('array_test.js - not equal!');
		process.exit();
	}
};
