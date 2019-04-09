# kzip

Base on node zip to make dist file zipped!

## Problem to be solved

Commonly, we build our webapp we got a lot of change in git panel which is easy to neglect an unexpected change.

So I use this to zip the dist file which make the change clear and relax.

Centainly you need server maintenance part to unziping the `dist.zip` autoly.

## Usage

```js
kzip({
    source: 'dist/*',
    destination: './dist.zip'
}).then(function () {
    console.log('zipped!');
}).catch(function (err) {
    console.error(err.stack);
    process.exit(1);
});
```

## Lincense

ISC