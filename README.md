# kty

封装 `tinypng` 完成前端构建时的图片瘦身工作，可结合 `npm script` 完成工作流的配套

## 基础
基于 [@mora/tinypng](https://github.com/qiu8310/tinypng) 封装而成，减少一些配置项，使用 `nodejs` 命令行运行，降低上手难度

## 使用

```js
const path = require('path')
const Ty = require('../lib')

let ty = new Ty({
    quiet: false,
    exclude: ['exclude'],
    tokens: ['RBPAYIpjk9Xa7878gWLqeqnUk1UEsNE3'],
    path: path.resolve(__dirname, './images'),
    cacheDir: path.resolve(__dirname, './cache'),
    recordFile: path.resolve(__dirname, './recordFile'),
})

ty.process()
```

## Lincense

ISC