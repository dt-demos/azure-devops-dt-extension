"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var tl = require("azure-pipelines-task-lib");
function log(message) {
    console.info("pushTaskResult: " + message);
}
function callback(error, response, body) {
    if (error) {
        tl.setResult(tl.TaskResult.Failed, "pushTaskResult: Error. " + error.message);
    }
    else {
        if (response.statusCode != "200") {
            tl.setResult(tl.TaskResult.Failed, "pushTaskResult: Failed. " + response.body);
        }
        else {
            log("Response body: " + response.body);
            tl.setResult(tl.TaskResult.Succeeded, "pushTaskResult: Succeeded");
        }
    }
}
;
function pushEvent() {
    return __awaiter(this, void 0, void 0, function () {
        var request, dynatraceApiToken, dynatraceTenantUrl, eventType, tagRule, source, customProperties, messagePayload, deploymentName, deploymentVersion, deploymentProject, remediationAction, ciLink, description, original, configuration, description, title, messagePayloadString, deploymentEventUrl, options;
        return __generator(this, function (_a) {
            try {
                request = require('request');
                // getting all parameter variables
                log("Getting all parameter variables");
                dynatraceApiToken = tl.getInput('dynatraceApiToken', true);
                dynatraceTenantUrl = tl.getInput('dynatraceTenantUrl', true);
                eventType = tl.getInput('eventType', true);
                tagRule = JSON.parse(String(tl.getInput('tagRule', true)));
                source = tl.getInput('source', true);
                customProperties = JSON.parse(String(tl.getInput('customProperties', false)));
                // creating message payload
                log("Creating message payload for eventType: " + eventType);
                switch (eventType) {
                    case 'deployment':
                        deploymentName = tl.getInput('deploymentName', true);
                        deploymentVersion = tl.getInput('deploymentVersion', true);
                        deploymentProject = tl.getInput('deploymentProject', false);
                        remediationAction = tl.getInput('remediationAction', false);
                        ciLink = tl.getInput('ciLink', false);
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
                        description = tl.getInput('description', true);
                        original = tl.getInput('original', false);
                        configuration = tl.getInput('configuration', true);
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
                        description = tl.getInput('description', true);
                        title = tl.getInput('title', false);
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
                messagePayloadString = JSON.stringify(messagePayload);
                deploymentEventUrl = dynatraceTenantUrl + "/api/v1/events";
                options = {
                    url: deploymentEventUrl,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Api-Token ' + dynatraceApiToken
                    },
                    body: messagePayloadString
                };
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
            return [2 /*return*/];
        });
    });
}
pushEvent();
