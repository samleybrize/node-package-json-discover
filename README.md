# package-json-discover

Discover and load `package.json` files.

[![Build Status](https://travis-ci.org/samleybrize/node-package-json-discover.svg?branch=master)](https://travis-ci.org/samleybrize/node-package-json-discover)

## Installation

You can install with `npm`:

```bash
npm install package-json-discover
```

## Usage

**/path/to/project/index.js :**

```javascript
var pjd = require("package-json-discover");

// will try to load in order (stop on first file found) :
// - /path/to/project/package.json
// - /path/to/package.json
// - /path/package.json
// - /package.json
var packageJson = pjd.load();

// will try to load in order (stop on first file found) :
// - /path/to/project/sub/dir/package.json
// - /path/to/project/sub/package.json
// - /path/to/project/package.json
// - /path/to/package.json
// - /path/package.json
// - /package.json
var packageJson = pjd.load("sub/dir");

console.log(packageJson.version);
```

## API

***load([{string} from])***

> Loads the closest `package.json` file. The `from` arg define the directory where to start discovering. If no `package.json` is found within that directory,
> search will continue on parent directories until the root directory. An error is thrown if no `package.json` were found.
>
> The `from` arg can be absolute or relative to the current file. If it is omitted, it is the file where you call or bind the `load()` function.
>
> `package.json` existence is verified only once per directory. If you call `discover()` or `load()` on the `/path/to/project` directory several times,
> verification will occur on the first time you call it, and starting from the second time the path is returned directly.
>
> Returns the loaded JSON object.

***discover([{string} from])***

> Search the closest `package.json` file. The `from` arg define the directory where to start discovering. If no `package.json` is found within that directory,
> search will continue on parent directories until the root directory. An error is thrown if no `package.json` were found.
>
> The `from` arg can be absolute or relative to the current file. If it is omitted, it is the file where you call or bind the `load()` function.
>
> `package.json` existence is verified only once per directory. If you call `discover()` or `load()` on the `/path/to/project` directory several times,
> verification will occur on the first time you call it, and starting from the second time the path is returned directly.
>
> Returns the found path.

## Author

This project is authored and maintained by Stephen Berquet.

## License

Licensed under the MIT License - see the [LICENSE](LICENSE) file for details

