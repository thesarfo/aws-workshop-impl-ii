// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const AWS = require('aws-sdk')

const rdsdataservice = new AWS.RDSDataService();

const params = {
  resourceArn: process.env.DATABASE_ARN,
  secretArn: process.env.SECRET_ARN,
  sql: `DROP TABLE games;`
}

rdsdataservice.executeStatement(params, function(err, data) {
  if (err) {
    console.log(err, err.stack)
  } else {
    console.log('Tables deleted successfully!')
  }
})
