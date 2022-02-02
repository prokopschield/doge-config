module.exports = () => {
    const { ConfigDir } = require('..');
    const cd = new ConfigDir('confdir');

    cd.foo = 'bar';
    cd.fizz = ['bazz'];
    cd.one.obj.two.__set('three', 'counting');

    if (cd.data.foo !== 'bar') {
        throw new Error('tests/confdir.js assertion failed [1]');
    }

    if (cd.fizz.array.pop() !== 'bazz') {
        throw new Error('tests/confdir.js assertion failed [2]');
    }

    if (cd.one.obj.two.array.pop() !== 'counting') {
        throw new Error('tests/confdir.js assertion failed [3]');
    }
};
