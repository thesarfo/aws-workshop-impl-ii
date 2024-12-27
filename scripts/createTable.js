// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const AWS = require('aws-sdk')

const rdsdataservice = new AWS.RDSDataService();

const params = {
  resourceArn: process.env.DATABASE_ARN,
  secretArn: process.env.SECRET_ARN,
  database: 'leaderboard',
  sql: `CREATE TABLE games (
game_id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(50) NOT NULL,
gamedate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
score INT NOT NULL,
level INT NOT NULL
);`
}

rdsdataservice.executeStatement(params, function(err, data) {
  if (err) {
    console.log(err, err.stack)
  } else {
    console.log('Table created successfully!')
  }
})
