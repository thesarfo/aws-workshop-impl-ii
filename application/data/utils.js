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

const executeWriteSql = async (sql, parameters) => {
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

module.exports = {
  executeReadSql,
  executeWriteSql
}
