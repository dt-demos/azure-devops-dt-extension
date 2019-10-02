#!/bin/bash

# this will read in the environment variable values
file=publish-inputs.sh
if ! [ -f $file ]; then
    echo "Aborting. Missing $file."
    exit 1
fi
source $file

VERSION=$MAJOR_VERSION.$MINOR_VERSION.$PATCH_VERSION

echo "==============================================="
echo "About to publish using:"
echo "DEVOPS_EXTENSION_NAME : $DEVOPS_EXTENSION_NAME"
echo "DEVOPS_PUBLISHER      : $DEVOPS_PUBLISHER"
echo "VERSION               : $VERSION"
echo "SHARE_WITH            : $SHARE_WITH"
echo "==============================================="
read -p "Press enter to continue or Control-C to abort"

echo "==============================================="
echo "Updating vss-extension.json with publisher $DEVOPS_PUBLISHER"
echo "==============================================="
cd ../pushEvent

cp vss-extension.json bak/vss-extension.json.publisher.bak
cat bak/vss-extension.json.publisher.bak | \
    sed -e 's/"publisher": ".*/"publisher": "'$DEVOPS_PUBLISHER'",/g' > vss-extension.json

echo "==============================================="
echo "Updating vss-extension.json with version $VERSION"
echo "==============================================="

cp vss-extension.json bak/vss-extension.json.version.bak
cat bak/vss-extension.json.version.bak | \
    sed -e 's/"version": ".*/"version": "'$VERSION'",/g' > vss-extension.json

echo "==============================================="
echo "Updating task.json files with version $VERSION"
echo "==============================================="
cd src
cp task.json bak/task.json.version.bak
cat bak/task.json.version.bak | \
    sed -e 's/"Major": ".*/"Major": "'$MAJOR_VERSION'",/g' | \
    sed -e 's/"Minor": ".*/"Minor": "'$MINOR_VERSION'",/g' | \
    sed -e 's/"Patch": ".*/"Patch": "'$PATCH_VERSION'"/g' > task.json

cp task.json bak/task.json.friendlyName.bak
cat bak/task.json.friendlyName.bak | \
    sed -e 's/"friendlyName": ".*/"friendlyName": "'$VERSION' Push Dynatrace Event Task",/g' > task.json
cd ..

echo "==============================================="
echo "Publishing Extension $DEVOPS_EXTENSION_NAME"
echo "==============================================="
tfx extension publish \
    --token $DEVOPS_PERSONAL_ACCESS_TOKEN \
    --share-with $SHARE_WITH \
    --output-path ./extension-packages

echo "==============================================="
echo "Validating Extension $DEVOPS_EXTENSION_NAME"
echo "==============================================="
tfx extension isvalid \
    --publisher $DEVOPS_PUBLISHER \
    --extension-id $DEVOPS_EXTENSION_NAME \
    --service-url https://marketplace.visualstudio.com/ \
    --token $DEVOPS_PERSONAL_ACCESS_TOKEN 

# return back to scripts folder
cd ../scripts
echo "==============================================="
echo Done.