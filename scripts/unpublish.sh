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
  ;;
PROD)
  DEVOPS_PUBLISHER=$DEVOPS_PROD_PUBLISHER
  ;;
*)
  echo "Invalid or missing argument.  Must be DEV or PROD"
  exit 1
  ;;
esac

echo "==============================================="
echo "About to unpublish using:"
echo "DEVOPS_EXTENSION_NAME : $DEVOPS_EXTENSION_NAME"
echo "DEVOPS_PUBLISHER      : $DEVOPS_PUBLISHER"
echo "==============================================="
read -p "Press enter to continue or Control-C to abort"

echo "==============================================="
echo "Unpublishing $DEVOPS_EXTENSION_NAME into $TARGET"
echo "==============================================="
cd ..
tfx extension unpublish \
        --token $DEVOPS_PERSONAL_ACCESS_TOKEN \
        --publisher $DEVOPS_PUBLISHER \
        --extension-id $DEVOPS_EXTENSION_NAME
cd scripts

echo "==============================================="
echo Done.