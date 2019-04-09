"use strict";

const fs = require("fs");
const path = require("path");

const archiver = require("archiver");
const async = require("async");
const glob = require("glob");

// based on http://stackoverflow.com/questions/15641243/need-to-zip-an-entire-directory-using-node-js/18775083#18775083
const nodeZip = (options) => {
    return new Promise((resolve, reject) => {
        const cwd = options.cwd || process.cwd();
        const output = fs.createWriteStream(path.resolve(cwd, options.destination));
        const archive = archiver("zip");

        output.on("close", resolve);
        archive.on("error", reject);

        archive.pipe(output);

        const globOpts = {
            cwd: cwd,
            // options to behave more like the native zip's glob support
            dot: false, // ignore .dotfiles
            noglobstar: true, // treat ** as *
            noext: true, // no (a|b)
            nobrace: true // no {a,b}
        };

        function findSource(source, next) {
            if (glob.hasMagic(source, globOpts)) {
                // archiver uses this library but somehow ends up with different results on windows:
                // archiver.glob('*') will include subdirectories, but omit their contents on windows
                // so we'll use glob directly, and add all of the files it finds
                glob(source, globOpts, function (err, files) {
                    if (err) {
                        return next(err);
                    }
                    async.forEach(files, addSource, next);
                });
            } else {
                addSource(source, next);
            }
        }

        function addSource(source, next) {
            const fullPath = path.resolve(cwd, source);
            const destPath = source;
            fs.stat(fullPath, function (err, stats) {
                if (err) {
                    return next(err);
                }
                if (stats.isDirectory()) {
                    archive.directory(fullPath, destPath);
                } else if (stats.isFile()) {
                    archive.file(fullPath, {
                        stats: stats,
                        name: destPath
                    });
                }
                next();
            });
        }

        const sources = Array.isArray(options.source) ?
            options.source : [options.source];

        async.forEach(sources, findSource, function (err) {
            if (err) {
                return reject(err);
            }
            archive.finalize();
        });
    })
}

function kzip(options) {
    const compatMode = typeof options === "string";

    if (compatMode) {
        options = {
            source: arguments[1],
            destination: arguments[0]
        };
    }

    let promise = nodeZip(options)
    if (compatMode) {
        promise.then(arguments[2]).catch(arguments[2]);
    } else {
        return promise;
    }
}

module.exports = kzip
module.exports.kzip = kzip