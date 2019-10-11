import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

describe('Push Event Tests', function () {

    before( function() {

    });

    after(() => {

    });

    it('deploymentSuccess', function(done: MochaDone) {

        let tp = path.join(__dirname, 'deploymentSuccess.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();

        // uncomment for debug output
        //console.log(tr.stdout);
        assert.equal(tr.succeeded, true, 'should have succeeded');

        done();
    });

    it('customInfoSuccess', function(done: MochaDone) {
        let tp = path.join(__dirname, 'customInfoSuccess.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();

        // uncomment for debug output
        //console.log(tr.stdout);
        assert.equal(tr.succeeded, true, 'should have succeeded');

        done();
    });

    it('configurationSuccess', function(done: MochaDone) {
        let tp = path.join(__dirname, 'configurationSuccess.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();

        // uncomment for debug output
        //console.log(tr.stdout);
        assert.equal(tr.succeeded, true, 'should have succeeded');

        done();
    });
   
});