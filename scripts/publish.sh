#!/bin/bash

# this will read in the environment variable values
file=publish-inputs.sh
if ! [ -f $file ]; then
    echo "Aborting. Missing $file."
    exit 1
fi
source $file

# set the values defined in the publish-inputs.sh file
# based on what target was passed in as an argument
TARGET=$1
case $TARGET in
DEV)
  DEVOPS_PUBLISHER=$DEVOPS_DEV_PUBLISHER
  TASK_GUID=$DEVOPS_DEV_TASK_GUID
  SHARE_WITH=$DEVOPS_DEV_SHARE_WITH
  ;;
PROD)
  DEVOPS_PUBLISHER=$DEVOPS_PROD_PUBLISHER
  TASK_GUID=$DEVOPS_PROD_TASK_GUID
  ;;
*)
  echo "Invalid or missing argument.  Must be DEV or PROD"
  exit 1
  ;;
esac

echo ""
echo "==============================================="
echo "About to publish to '$TARGET' using:"
echo "DEVOPS_EXTENSION_NAME : $DEVOPS_EXTENSION_NAME"
echo "DEVOPS_PUBLISHER      : $DEVOPS_PUBLISHER"
echo "TASK_GUID             : $TASK_GUID"
echo "SHARE_WITH            : $SHARE_WITH"
echo "==============================================="
read -p "Press enter to continue or Control-C to abort"

echo "==============================================="
echo "Updating vss-extension.json file"
echo "==============================================="
echo "setting 'publisher' to $DEVOPS_PUBLISHER"
cd ../pushEvent

BACKUP_DIR=../scripts/json-backup

# set the published defined for the target environment
cp vss-extension.json $BACKUP_DIR/vss-extension.json.publisher.bak
cat $BACKUP_DIR/vss-extension.json.publisher.bak | \
    sed -e 's/"publisher": ".*/"publisher": "'$DEVOPS_PUBLISHER'",/g' > vss-extension.json

# set the name to have (TARGET) suffix for the non-PROD environment  
echo "setting 'name'"
cp vss-extension.json $BACKUP_DIR/vss-extension.json.name.bak
if [[ "$TARGET" == "PROD" ]]; then
  cat $BACKUP_DIR/vss-extension.json.name.bak | \
      sed -e 's/"name": ".*,/"name": "Dynatrace Push Event",/g' > vss-extension.json
else
  cat $BACKUP_DIR/vss-extension.json.name.bak | \
      sed -e 's/"name": ".*,/"name": "Dynatrace Push Event ('$TARGET')",/g' > vss-extension.json
fi

# set the 'public' flag, if this is PROD environment 
echo "setting 'public' marketplace flag "
cp vss-extension.json $BACKUP_DIR/vss-extension.json.public.bak
if [[ "$TARGET" == "PROD" ]]; then
  cat $BACKUP_DIR/vss-extension.json.public.bak | \
      sed -e 's/"public": .*,/"public": true,/g' > vss-extension.json
else
  cat $BACKUP_DIR/vss-extension.json.name.bak | \
      sed -e 's/"public": .*,/"public": false,/g' > vss-extension.json
fi

echo "==============================================="
echo "Publishing $DEVOPS_EXTENSION_NAME into $TARGET"
echo "==============================================="

VSIX_DIR=../scripts/extension-packages

# the --rev-version flag automatically updates the vss-extension.json file
# with the next patch version

if [[ "$TARGET" == "PROD" ]]; then
    tfx extension publish \
        --token $DEVOPS_PERSONAL_ACCESS_TOKEN \
        --output-path $VSIX_DIR \
        --rev-version
else
    tfx extension publish \
        --token $DEVOPS_PERSONAL_ACCESS_TOKEN \
        --output-path $VSIX_DIR \
        --share-with $SHARE_WITH \
        --rev-version
fi

# return back to scripts folder
cd ../scripts

echo "==============================================="
echo "Done."