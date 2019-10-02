"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tmrm = require("azure-pipelines-task-lib/mock-run");
var path = require("path");
var fs = require("fs");
var taskPath = path.join(__dirname, '..', 'pushEventTask.js');
var tmr = new tmrm.TaskMockRunner(taskPath);
// read dynatrace secrets from file
var valuesContent = fs.readFileSync("input-files/test-inputs.json");
var valuesJson = JSON.parse(valuesContent);
// read tag array and customer properties from file
var tagRule = fs.readFileSync("input-files/tagRule.txt");
var customProperties = fs.readFileSync("input-files/customProperties.txt");
// set inputs to push Dynatrace event
tmr.setInput('dynatraceApiToken', valuesJson.dynatraceApiToken);
tmr.setInput('dynatraceTenantUrl', valuesJson.dynatraceTenantUrl);
tmr.setInput('eventType', 'custom');
tmr.setInput('tagRule', tagRule);
tmr.setInput('customProperties', customProperties);
tmr.setInput('description', 'Mock description');
tmr.setInput('title', 'Mock Custom Info Event');
tmr.setInput('source', 'Mock Test - customInfoSuccess');
tmr.run();
