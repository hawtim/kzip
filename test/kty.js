const path = require('path')
const Ty = require('../lib')

let instance = new Ty({
    quiet: false,
    exclude: ['exclude'],
    tokens: ['RBPAYIpjk9Xa7878gWLqeqnUk1UEsNE3'],
    path: path.resolve(__dirname, './images'),
    cacheDir: path.resolve(__dirname, './cache'),
    recordFile: path.resolve(__dirname, './recordFile'),
})

instance.process()
