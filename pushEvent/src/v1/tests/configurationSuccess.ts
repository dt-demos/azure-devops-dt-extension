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
tmr.setInput('eventType', 'configuration');
tmr.setInput('tagRule', tagRule);
tmr.setInput('customProperties',customProperties);

tmr.setInput('description', 'Mock description');
tmr.setInput('source', 'Mock source');
tmr.setInput('original', 'Mock original');
tmr.setInput('configuration', 'Mock configuration');

tmr.run();
