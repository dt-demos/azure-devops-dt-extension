"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var assert = __importStar(require("assert"));
var ttm = __importStar(require("azure-pipelines-task-lib/mock-test"));
describe('Push Event Tests', function () {
    before(function () {
    });
    after(function () {
    });
    it('deploymentSuccess', function (done) {
        var tp = path.join(__dirname, 'deploymentSuccess.js');
        var tr = new ttm.MockTestRunner(tp);
        tr.run();
        // uncomment for debug output
        //console.log(tr.stdout);
        assert.equal(tr.succeeded, true, 'should have succeeded');
        done();
    });
    it('customInfoSuccess', function (done) {
        var tp = path.join(__dirname, 'customInfoSuccess.js');
        var tr = new ttm.MockTestRunner(tp);
        tr.run();
        // uncomment for debug output
        //console.log(tr.stdout);
        assert.equal(tr.succeeded, true, 'should have succeeded');
        done();
    });
    it('configurationSuccess', function (done) {
        var tp = path.join(__dirname, 'configurationSuccess.js');
        var tr = new ttm.MockTestRunner(tp);
        tr.run();
        // uncomment for debug output
        //console.log(tr.stdout);
        assert.equal(tr.succeeded, true, 'should have succeeded');
        done();
    });
});
