var packageJsonDiscover = require("..");
var chai                = require("chai");
var path                = require("path");
var proxyquire          = require('proxyquire').noPreserveCache();

// TODO test cache
describe("package-json-discover", function() {
    beforeEach("Clear cache path", function() {
        packageJsonDiscover.destroyCache();
    });

    describe(".discover()", function() {
        it("found with 'from' arg", function() {
            var expectedPath = path.resolve(path.join(__dirname, "../package.json"));
            chai.expect(packageJsonDiscover.discover(__dirname + "/from/sub/dir")).to.equal(expectedPath);
            chai.expect(packageJsonDiscover.discover("from/sub/dir")).to.equal(expectedPath);
        });

        it("found without 'from' arg", function() {
            var expectedPath = path.resolve(path.join(__dirname, "../package.json"));
            chai.expect(packageJsonDiscover.discover()).to.equal(expectedPath);
        });

        it("found package.json on same level as 'from'", function() {
            var expectedPath = path.resolve(path.join(__dirname, "../package.json"));
            chai.expect(packageJsonDiscover.discover("..")).to.equal(expectedPath);
        });

        it("throw if not a string", function() {
            chai.expect(packageJsonDiscover.discover.bind(packageJsonDiscover, 4)).to.throw("'from' must be a string, [number] given");
        });

        it("no package.json found", function() {
            var p = path.resolve(__dirname, "../..");
            chai.expect(packageJsonDiscover.discover.bind(packageJsonDiscover, "../..")).to.throw("Unabe to find a package.json from '" + p + "'");
        });

        it("use path cache", function() {
            var fsExistsIgnore  = null;
            var disableFs       = false;
            var fsStub          = {
                existsSync: function(path) {
                    if (disableFs && path !== fsExistsIgnore) {
                        throw new Error("fs.existsSync() has been called");
                    } else {
                        return require("fs").existsSync(path);
                    }
                },
                lstatSync: function(path) {
                    return require("fs").lstatSync(path);
                },
                "@noCallThru": true
            };
            var packageJsonDiscoverStubbed = proxyquire("..", {
                fs: fsStub
            });

            // fill the path cache
            var inputDir1       = __dirname + "/from/sub/dir";
            var inputDir2       = path.dirname(__dirname);
            var expectedPath    = path.resolve(path.join(__dirname, "../package.json"));
            chai.expect(packageJsonDiscoverStubbed.discover(inputDir1)).to.equal(expectedPath);

            // disable fs.existsSync() that is used
            disableFs       = true;
            fsExistsIgnore  = inputDir1;
            chai.expect(packageJsonDiscoverStubbed.discover(inputDir1)).to.equal(expectedPath);
            chai.expect(packageJsonDiscoverStubbed.discover("from/sub/dir")).to.equal(expectedPath);

            fsExistsIgnore  = inputDir2;
            chai.expect(packageJsonDiscoverStubbed.discover("..")).to.equal(expectedPath);
        });
    });

    describe(".load()", function() {
        it("found with 'from' arg", function() {
            var expectedPath = path.resolve(path.join(__dirname, "../package.json"));
            chai.expect(packageJsonDiscover.load(__dirname + "/from/sub/dir")).to.be.an.instanceof(Object);
            chai.expect(packageJsonDiscover.load("from/sub/dir")).to.be.an.instanceof(Object);
        });

        it("found without 'from' arg", function() {
            var expectedPath = path.resolve(path.join(__dirname, "../package.json"));
            chai.expect(packageJsonDiscover.load()).to.be.an.instanceof(Object);
        });

        it("found package.json on same level as 'from'", function() {
            var expectedPath = path.resolve(path.join(__dirname, "../package.json"));
            chai.expect(packageJsonDiscover.load("..")).to.be.an.instanceof(Object);
        });

        it("throw if not a string", function() {
            chai.expect(packageJsonDiscover.load.bind(packageJsonDiscover, 4)).to.throw("'from' must be a string, [number] given");
        });

        it("no package.json found", function() {
            var p = path.resolve(__dirname, "../..");
            chai.expect(packageJsonDiscover.load.bind(packageJsonDiscover, "../..")).to.throw("Unabe to find a package.json from '" + p + "'");
        });
    });
});
