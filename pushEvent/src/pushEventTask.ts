var tl = require('azure-pipelines-task-lib');
var request = require('request');

// show the task version information
var toolRunner = new tl.ToolRunner(tl.which('echo', true));
console.info("ToolRunner details = ");
console.info(toolRunner);

// getting all parameter variables

console.info("getting all parameter variables");

var dynatraceApiToken = tl.getInput('dynatraceApiToken', true);
var dynatraceTenantUrl = tl.getInput('dynatraceTenantUrl', true);
var eventType = tl.getInput('eventType', true);
var tagRule = JSON.parse(tl.getInput('tagRule', true));
var source = tl.getInput('source', true);
var customProperties = JSON.parse(tl.getInput('customProperties', false));

console.info("Retrieved all common input parameters.");

// creating message payload
var messagePayload;
switch(eventType) {
    case 'deployment':
        var deploymentName = tl.getInput('deploymentName', true);
        var deploymentVersion = tl.getInput('deploymentVersion', true);
        var deploymentProject = tl.getInput('deploymentProject', false);
        var remediationAction = tl.getInput('remediationAction', false);
        var ciLink = tl.getInput('ciLink', false);
        messagePayload = {
            eventType: "CUSTOM_DEPLOYMENT",
            attachRules: {
                "tagRule": tagRule
            },
            customProperties: customProperties,
            source: source,
            deploymentName: deploymentName,
            deploymentVersion: deploymentVersion,
            deploymentProject: deploymentProject,
            ciBackLink: ciLink,
            remediationAction: remediationAction,
        };
        break;
    case 'configuration':
        var description = tl.getInput('description', true);
        var original = tl.getInput('original', false);
        var configuration = tl.getInput('configuration', true);
        messagePayload = {
            eventType: "CUSTOM_CONFIGURATION",
            attachRules: {
                "tagRule": tagRule
            },
            customProperties: customProperties,
            description: description,
            source: source,
            original: original,
            configuration: configuration
        };
        break;
    case 'custom':
        var description = tl.getInput('description', true);
        var title = tl.getInput('title', false);
        messagePayload = {
            eventType: "CUSTOM_INFO",
            attachRules: {
                "tagRule": tagRule
            },
            customProperties: customProperties,
            description: description,
            title: title,
            source: source
        };
        break;
}

// creating dynatrace post deployment event
var messagePayloadString = JSON.stringify(messagePayload);
var deploymentEventUrl = dynatraceTenantUrl + "/api/v1/events";
var options = {
    url: deploymentEventUrl,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Api-Token ' + dynatraceApiToken
    },
    body: messagePayloadString
}

function callback(error: { statusCode: string; message: string; }, response: { statusCode: string; body: string; }, body: any) {
    console.info("Returned from request.");
    if (error) {
        console.info("Got Error statusCode: " + error.statusCode);
        console.info("Got Error message: " + error.message);
    }
    else {
        console.info("Returned status code: " + response.statusCode);
        console.info("Returned body: " + response.body);
    }
};

console.info("Sending deployment request event to Dynatrace...");
console.info("deploymentEventUrl: " + deploymentEventUrl);
console.info("messagePayloadString: " + messagePayloadString);

// Make the call to push the Dyntrace event
request.post(options, callback);
console.info("Done sending deployment request event to dyntrace.");

// TO DO: add check for Returned status code: 200

toolRunner.exec({ failOnStdErr: false })
.then(function (code: any) {
    console.info("pushTaskResult: Succeeded");
    tl.setResult(tl.TaskResult.Succeeded, code);
})
.fail(function(err: { message: string; }) {
    console.error("pushTaskResult: Error:" + err.message);
    tl.setResult(tl.TaskResult.Failed, err.message);
})
