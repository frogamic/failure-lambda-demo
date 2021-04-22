#! /usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset

PROJECT="failure-lambda-demo"
BUILD_IDENTIFIER="$(date +%s)"
CODE_SUBFOLDER="src"

die() {
	echo $1 >&2
	exit 1
}

if [[ ! "$#" == "1" ]]; then
	die "Usage: $(basename "$0") <stack-variant>"
fi

STACK_VARIANT="$1"
cd "$(dirname "$0")/${STACK_VARIANT}"

if [ -d "$CODE_SUBFOLDER" ]; then
	DEPLOY_BUCKET="$(aws cloudformation describe-stacks \
		--stack-name failure-lambda-demo \
		--query "Stacks[0].Outputs[?OutputKey=='DeployBucket'].OutputValue" \
		--output text \
	)"
	echo
	echo "Deploying code from ${STACK_VARIANT}/${CODE_SUBFOLDER} to ${DEPLOY_BUCKET}"
	mkdir -p dist
	rm -Rf dist/*
	cd "$CODE_SUBFOLDER"
	npm ci
	zip -r "../${BUILD_IDENTIFIER}.zip" *
	cd ..

	aws s3 cp "${BUILD_IDENTIFIER}.zip" "s3://${DEPLOY_BUCKET}/"
	rm "${BUILD_IDENTIFIER}.zip"
fi

echo
echo "Deploying stack from ${STACK_VARIANT}/template.yml"
cfn-lint "template.yml"
aws cloudformation deploy --stack-name "$PROJECT"\
	--template-file "template.yml" \
	--no-fail-on-empty-changeset \
	--capabilities CAPABILITY_IAM \
	--parameter-overrides "BuildIdentifier=${BUILD_IDENTIFIER}"
