const co = require('co');

const fetch = require('isomorphic-fetch');

function* getData() {
    const res = yield fetch('http://jsonplaceholder.typicode.com/users/1');
    const json = yield res.json();
    return json.company;
}

function run(generator) {
    const iterator = generator();
    if (iterator === undefined) {
        throw new TypeError('Argument must be a generator');
    }
    function iterate(step) {
        if(step.done) return step.value;
        const promise = step.value;
        if (!(promise instanceof Promise)) return run(iterator, step.value);
        if (typeof step.value === 'function') return run(iterator, step.value());
        return promise.then(result => iterate(iterator.next(result)), err => iterator.throw(err));
    }
    return iterate(iterator.next());
}

run(getData)
    .then((result) => console.log(result))
    .catch((err) => console.log(err));

co(getData)
    .then((result) => console.log(result))
    .catch((err) => console.log(err));