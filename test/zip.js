var kzip = require('../lib')

kzip({
    source: 'dist/*',
    destination: './dist.zip'
}).then(function () {
    console.log('zipped!');
}).catch(function (err) {
    console.error(err.stack);
    process.exit(1);
});
