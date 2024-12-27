// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const AWS = require('aws-sdk')

const rdsdataservice = new AWS.RDSDataService();

const parseRecords = (records, columnMetadata) => {
  // Format the results into key-value pairs with the column name and value
  const parsed = records.map((result) => {
    const obj = {}
    result.forEach((elem, idx) => {
      const columnName = columnMetadata[idx].name
      const [ columnValue, ]= Object.values(elem)
      obj[columnName] = columnValue
    })
    return obj
  })
  return parsed

}

const executeReadSql = async (sql, parameters) => {
  const params = {
    resourceArn: process.env.DATABASE_ARN,
    secretArn: process.env.SECRET_ARN,
    database: 'leaderboard',
    includeResultMetadata: true,
    sql
  }
  if (parameters) {
    params.parameters = parameters
  }
  const rawResults = await rdsdataservice.executeStatement(params).promise()
  let results = []
  if (rawResults.records) {
    results = parseRecords(rawResults.records, rawResults.columnMetadata)
  }
  return results
}

const fetchHighScoresForUser = async (username, count) => {
  const parameters = [
    {
      name: 'username',
      value: { stringValue: username }
    },
    {
      name: 'count',
      value: { longValue: count }
    }
  ]
  const sql = 'SELECT game_id, username, gamedate, score, level FROM games WHERE username = :username ORDER BY score DESC LIMIT :count'
  const result = await executeReadSql(sql, parameters)
  return result
}

fetchHighScoresForUser('ubecker', 1).then((results) => console.log(JSON.stringify(results, null, 2)))
