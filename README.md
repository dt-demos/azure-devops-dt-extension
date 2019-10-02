
# Overview

This repo contains the soure code and instructions for buulding your an Azure DevOps extention allows you to integrate [Deployment Event](https://www.dynatrace.com/support/help/extend-dynatrace/dynatrace-api/environment-api/events/post-event) into your release pipelines. See the [Extension README](pushEvent/README.md) for an overview of usage and features.

For an overview of the process to develop extensions, read this [Microsoft guide](https://docs.microsoft.com/en-us/azure/devops/extend/get-started/node?view=vsts) and [this blog series](https://devkimchi.com/2019/06/26/building-azure-devops-extension-on-azure-devops-1/). 



# Build and publish

_**NOTE: The instructions and helper scripts assume MacOS.**_

## Prerequisites

1. Create or have access to add extenstions to a [Azure DevOps account](https://visualstudio.microsoft.com/team-services/)

1. Create Azure Marketplace publisher account - See this [Microsoft guide](https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=vsts#createpublisher) for help

## Development environment

1. [Install Node](https://nodejs.org/en/download/package-manager/#macos)

1. Install an IDE. I use [Visual Studio Code](https://code.visualstudio.com/)

## Project setup

1. Fork this repo so that you can adjust for your needs.  The file structure is as follows:

* ```pushEvent/``` contains the extension source
* ```pushEvent/tests``` Mock unit tests that use the 'azure-pipelines-task-lib/mock-test' module
* ```pushEvent/extension-packages``` where the compiled extension archive files are placed
* ```scripts/``` bash scripts used to compile, test and publish the extension

1. Edit ```pushEvent/vss-extension.json``` and ```pushEvent/src/task.json```files with your values for id, name, publisher, and other attributes as needed.

1. Adjust the ```icon.png``` files.  These need to be 32x32 pixels.

1. Replace the GUID id value in  ```pushEvent/src/task.json```.  Use the [GUID generator](https://www.guidgen.com) to get an unique value

_NOTE: These commands have already been done and the resulting files are already in this repo, but 
for your reference these were the below commands used during project creation as taken from the [Microsoft guide](https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops#step-1-create-the-custom-task)_

```
npm install azure-pipelines-task-lib --save
npm install @types/node --save-dev
npm install @types/q --save-dev
npm install --save requests
npm install -g typescript
npm install -g tfx-cli
tsc --init
```

## Development and testing

The ```pushEvent/tests/_suite.ts``` test suite file defines the tests that will send events the defined
Dynatrace enviromment.  To make the test work, follows these steps:

1. Copy the test inputs template and adjust the values for your Dynatrace environment

    ```
    cd pushEvent/tests/input-files
    cp test-inputs.json.template test-inputs.json
    # edit test-inputs.json
    ```

1. Edit the ```pushEvent/tests/input-files/tagRule.txt``` file as to match some Dynatrace monitored service.

1. Optionally, edit the ```pushEvent/tests/input-files/customProperties.txt``` for testing.


1. Run the provide script to compile and run the mocha test suite.

    ```
    cd scripts
    ./compile.sh
    ```

## Publication setup

Each extention needs a unique version and needs to be a "vsix" archive file that is uploaded to the Microsoft Marketplace. The ```scripts/publish.sh``` script is provided to update the json files, compile the extension and publish it.

1. Create a DevOps personal access token.  See this [Microsoft guide](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops).

1. First copy the publish inputs template and adjust the values for your Extension. (Version, Publisher, Personal Access token, Extension Name)

    ```
    # cd into the root project folder
    cp publish-inputs.sh.template publish-inputs.sh
    # edit publish-inputs.sh
    ```

1. Run the publish script

    ```
    cd scripts
    ./publish.sh
    ```

1. Verify the published extension in the [Marketplace](https://marketplace.visualstudio.com/manage/publishers). It should look something like this

    <img src="images/marketplace.png" width="100%">

# Reference

* [Microsoft building custom tasks](https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops)
* [Microsoft task schema](https://github.com/Microsoft/azure-pipelines-task-lib/blob/master/tasks.schema.json)
* [Microsoft Extension manifest reference](https://docs.microsoft.com/en-us/azure/devops/extend/develop/manifest?view=vsts)
* [Generate GUID](https://www.guidgen.com/)
* [Extention ICONS](http://www.iconarchive.com/show/square-animal-icons-by-martin-berube.html)
* [Azure DevOps Extension Tasks to automate the publication flow in Azure DevOps](https://marketplace.visualstudio.com/items?itemName=ms-devlabs.vsts-developer-tools-build-tasks)