# Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0
source env.sh

echo "Creating REST API"
REST_API_ID=$(aws apigateway create-rest-api \
  --name 'Leaderboard API' \
  --query 'id' \
  --output text)

echo "Fetching root resource"
ROOT_RESOURCE_ID=$(aws apigateway get-resources \
  --rest-api-id ${REST_API_ID} \
  --query 'items[0].id' \
  --output text)

echo "Creating proxy resource"
PROXY_RESOURCE_ID=$(aws apigateway create-resource \
  --rest-api-id ${REST_API_ID} \
  --parent-id ${ROOT_RESOURCE_ID} \
  --path-part {proxy+} \
  --query 'id' \
  --output text)

echo "Creating method"
METHOD=$(aws apigateway put-method \
  --rest-api-id ${REST_API_ID} \
  --resource-id ${PROXY_RESOURCE_ID} \
  --http-method ANY \
  --authorization-type "NONE")

echo "Adding integration"
INTEGRATION=$(aws apigateway put-integration \
  --rest-api-id ${REST_API_ID} \
  --resource-id ${PROXY_RESOURCE_ID} \
  --http-method ANY \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri arn:aws:apigateway:${AWS_REGION}:lambda:path/2015-03-31/functions/${FUNCTION_ARN}/invocations)

echo "Creating deployment"
DEPLOYMENT=$(aws apigateway create-deployment \
  --rest-api-id ${REST_API_ID} \
  --stage-name prod)

echo "Fetching account ID"
ACCOUNT_ID=$(aws sts get-caller-identity \
  --query 'Account' \
  --output text)

echo "Adding lambda permission"
PERMISSION=$(aws lambda add-permission \
  --function-name leaderboard-api \
  --statement-id api-gateway \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:${AWS_REGION}:${ACCOUNT_ID}:${REST_API_ID}/*/*")

echo "REST API created"
echo ""
echo "Your API is available at: https://${REST_API_ID}.execute-api.${AWS_REGION}.amazonaws.com/prod"
echo "export BASE_URL=https://${REST_API_ID}.execute-api.${AWS_REGION}.amazonaws.com/prod" >> env.sh
