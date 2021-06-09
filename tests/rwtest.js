const { getConfig } = require('..');

module.exports = () => {
	const foo = getConfig('foo');
	const bar = getConfig('bar');

	foo.obj.foo = [ 'one', 'two', 'three' ];
	bar.__set('foo', {});

	bar.obj.foo = { ...foo.foo };

	if (foo.str.foo !== bar.str.foo) {
		console.log('rwtest.js - not equal!');
		console.log([
			foo.str.foo,
			bar.str.foo,
		]);
		process.exit();
	}
}
