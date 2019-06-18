'use strict'

const fs = require('fs')
const path = require('path')
const Tinypng = require('@mora/tinypng').Tinypng

let tinypng = null
class Ty {
    constructor(options) {
        // 解析需要遍历的文件夹
        this.path = options.path
        this.quiet = options.quiet
        this.tokens = options.tokens
        this.exclude = options.exclude
        this.cacheDir = options.cacheDir
        this.recordFile = options.recordFile
        return this.init()
    }
    init() {
        tinypng = new Tinypng({
            quiet: this.quiet,
            tokens: this.tokens,
            cacheDir: this.cacheDir,
            recordFile: this.recordFile
        })
        return this
    }
    writeImageViaBuffer(fileDir) {
        const distPath = path.resolve(__dirname, fileDir)
        tinypng.tiny(fileDir).then(minifiedBuffer => {
            fs.writeFileSync(distPath, minifiedBuffer, err => {
                if (err) {
                    console.log(err)
                }
                console.log('写入成功')
            })
        })
        .catch(err => {
            console.log(err)
        })
    }
    checkImageExt(fileDir) {
        const imageExt = ['png', 'png', 'jpeg', 'svg']
        return imageExt.some(item => fileDir.includes(item))
    }
    process() {
        const filePath = this.path
        // 根据文件路径读取文件，返回文件列表
        fs.readdir(filePath, (err, files) => {
            if (err) return console.warn(err)
            if (this.exclude.some(item => filePath.includes(item))) return // 跳过排除的文件夹
            files.forEach(filename => {
                // 获取当前文件的绝对路径
                var fileDir = path.join(filePath, filename)
                // 根据文件路径获取文件信息，返回一个 fs.Stats 对象
                fs.stat(fileDir, (err, stats) => {
                    if (err) {
                        console.warn('获取文件stats失败')
                    } else {
                        var isFile = stats.isFile() // 是文件
                        var isDir = stats.isDirectory() // 是文件夹
                        if (isDir) {
                            this.process(fileDir) //递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                        if (isFile && checkImageExt(fileDir)) {
                            this.writeImageViaBuffer(fileDir)
                        }
                    }
                })
            })
        })
    }
}

module.exports = Ty
module.exports.Ty = Ty
