import tl = require('azure-pipelines-task-lib');

function log(message: string) {
    console.info("pushTaskResult: " + message)
}

function callback(error: { statusCode: string; message: string; }, response: { statusCode: string; body: string; }, body: any) {
    if (error) {
        tl.setResult(tl.TaskResult.Failed, "pushTaskResult: Error. " + error.message);
    }
    else {
        if (response.statusCode != "200") {
            tl.setResult(tl.TaskResult.Failed, "pushTaskResult: Failed. " + response.body);
        } else {
            log("Response body: " + response.body);
            tl.setResult(tl.TaskResult.Succeeded, "pushTaskResult: Succeeded");
        }
    }
};

async function pushEvent() {
    try {

        var request = require('request');

        // getting all parameter variables
        log("Getting all parameter variables");
        var dynatraceApiToken = tl.getInput('dynatraceApiToken', true);
        var dynatraceTenantUrl = tl.getInput('dynatraceTenantUrl', true);
        var eventType = tl.getInput('eventType', true);
        var tagRule = JSON.parse(String(tl.getInput('tagRule', true)));
        var source = tl.getInput('source', true);
        var customProperties = JSON.parse(String(tl.getInput('customProperties', false)));

        // creating message payload
        log("Creating message payload for eventType: " + eventType);
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

        // Make the call to push the Dyntrace event
        log("Sending event to Dynatrace using:");
        log("  deploymentEventUrl: " + deploymentEventUrl);
        log("  messagePayloadString: " + messagePayloadString);
        request.post(options, callback);
        log("Done");
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, "pushTaskResult: Failed. " + err.message);
    }
}

pushEvent();
