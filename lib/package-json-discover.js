/*
 * This file is part of node-package-json-discover.
 *
 * (c) Stephen Berquet <stephen.berquet@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

var fs              = require("fs");
var path            = require("path");
var pathIsAbsolute  = require('path-is-absolute');
var caller          = require("caller");
var discoverCache   = {};

/**
 * Discovers the closest package.json file and returns its absolute path
 * @param {string} [from] - The path to the directory where to start discovering. If omitted, it is the path to the file that calls this function.
 * @returns {string}
 */
function discover(from) {
    from = from || caller();

    // check 'from' validity
    if ("string" != typeof from) {
        var given = typeof from;
        throw new Error("'from' must be a string, [" + given + "] given");
    }

    // if 'from' is not absolute, make it absolute
    if (!pathIsAbsolute(from)) {
        from = path.join(
            path.dirname(caller()),
            from
        );
    }

    // if 'from' is a file, keep its dirname
    if (fs.existsSync(from)) {
        var stat = fs.lstatSync(from);

        if (stat.isFile()) {
            from = path.dirname(from);
        }
    }

    // check path cache
    if (discoverCache[from]) {
        return discoverCache[from];
    }

    // process directories from 'from' to system root directory until we find a package.json file
    var dir                 = from;
    var old                 = null;
    var processedDirList    = [];

    while (true) {
        if (discoverCache[dir]) {
            // path from cache
            return discoverCache[dir];
        } else if (fs.existsSync(dir + "/package.json")) {
            // package.json found
            processedDirList.push(dir);
            var discoveredDir = dir + "/package.json";

            for (var i in processedDirList) {
                discoverCache[processedDirList[i]] = discoveredDir;
            }

            return discoveredDir;
        } else {
            // process parent directory
            old = dir;
            dir = path.dirname(dir);

            // check if we reached the system root directory
            if (old === dir) {
                break;
            }

            // add processed dir to the list
            processedDirList.push(old);
        }
    }

    throw new Error("Unabe to find a package.json from '" + from + "'");
}

/**
 * Override bind() function to integrate automating discovering of the caller file at bind time
 * @param thisArg
 * @param {string} [from] - The path to the directory where to start discovering. If omitted, it is the path to the file that calls this function.
 * @returns {Function}
 */
discover.bind = function(thisArg, from) {
    from = from || caller();

    // if 'from' is not absolute, make it absolute
    if ("string" === typeof from && !pathIsAbsolute(from)) {
        from = path.join(
            path.dirname(caller()),
            from
        );
    }

    return Function.prototype.bind.call(discover, thisArg, from);
};

/**
 * Loads the closest package.json file
 * @param {string} [from] - The path to the directory where to start discovering. If omitted, it is the path to the file that calls this function.
 * @returns {string}
 */
function load(from) {
    var packageJsonPath = discover(from);
    return require(packageJsonPath);
}

/**
 * Override bind() function to integrate automating discovering of the caller file at bind time
 * @param thisArg
 * @param {string} [from] - The path to the directory where to start discovering. If omitted, it is the path to the file that calls this function.
 * @returns {Function}
 */
load.bind = function(thisArg, from) {
    from = from || caller();

    // if 'from' is not absolute, make it absolute
    if ("string" === typeof from && !pathIsAbsolute(from)) {
        from = path.join(
            path.dirname(caller()),
            from
        );
    }

    return Function.prototype.bind.call(load, thisArg, from);
};

/**
 * Destroys the path cache
 */
function destroyCache() {
    discoverCache = {};
}

// exports
module.exports = {
    discover: discover,
    load: load,
    destroyCache: destroyCache
};
