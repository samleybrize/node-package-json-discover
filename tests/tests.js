var packageJsonDiscover = require("..");
var chai                = require("chai");
var path                = require("path");

describe("package-json-discover", function() {
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
