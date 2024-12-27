// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const AWS = require('aws-sdk')

const rdsdataservice = new AWS.RDSDataService();

const fetchHighScoresForUser= async (username, count) => {
  const params = {
    resourceArn: process.env.DATABASE_ARN,
    secretArn: process.env.SECRET_ARN,
    database: 'leaderboard',
    includeResultMetadata: true,
    sql: 'SELECT game_id, username, gamedate, score, level FROM games WHERE username = :username ORDER BY score DESC LIMIT :count',
    parameters: [
      {
        name: 'username',
        value: { stringValue: username }
      },
      {
        name: 'count',
        value: { longValue: count }
      }
    ]
  }
  const results = await rdsdataservice.executeStatement(params).promise()
  return results
}

fetchHighScoresForUser('ubecker', 1).then((results) => console.log(JSON.stringify(results, null, 2)))
