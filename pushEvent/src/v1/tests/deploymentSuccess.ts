import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
var fs = require("fs");

let taskPath = path.join(__dirname, '..', 'pushEventTask.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

// read dynatrace secrets from file
var valuesContent = fs.readFileSync("input-files/test-inputs.json");
var valuesJson = JSON.parse(valuesContent);

// read tag array and customer properties from file
var tagRule = fs.readFileSync("input-files/tagRule.txt");
var customProperties = fs.readFileSync("input-files/customProperties.txt");

// set inputs to push Dynatrace event
tmr.setInput('dynatraceApiToken', valuesJson.dynatraceApiToken);
tmr.setInput('dynatraceTenantUrl', valuesJson.dynatraceTenantUrl);
tmr.setInput('eventType', 'deployment');
tmr.setInput('tagRule', tagRule);
tmr.setInput('customProperties',customProperties);

tmr.setInput('deploymentName', 'Mock deploymentName');
tmr.setInput('deploymentVersion', 'Mock deploymentVersion');
tmr.setInput('deploymentProject', 'Mock deploymentProject');
tmr.setInput('source', 'Mock Test - deploymentSuccess');
tmr.setInput('ciLink', 'http://mock.ciLink');
tmr.setInput('remediationAction', '');

tmr.run();
