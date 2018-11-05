#!/usr/bin/env bash

. ${BASH_SOURCE%/*}/../load_variables.sh

CURRENT_PATH=$(pwd)
GH_REPO=github.com/opfab/operatorfabric.git
HTTP_REPO="https://davidbinderRTE:${GH_DOC_TOKEN}@${GH_REPO}"
git clone $HTTP_REPO $HOME/documentation
version=$(echo "$OF_VERSION"| sed s/-SNAPSHOT//)
for prj in "${OF_REL_COMPONENTS[@]}"; do
  echo "copying $prj documentation"
  mkdir -p $HOME/documentation/projects/$prj/$version/
  cp -r $prj/build/docs/* $HOME/documentation/projects/$prj/$version/.
done
cd $HOME/documentation
if [ -n "$(git status --porcelain)" ]; then
    echo "Changes to documentation detected, preparing commit"
    git add .
    git commit -m "Updating documentation"
    git push $HTTP_REPO master > /dev/null 2>&1
else
    echo "No changes to documentation detected"
fi
cd $CURRENT_PATH