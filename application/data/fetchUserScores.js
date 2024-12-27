// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const { executeReadSql } = require('./utils')

const fetchUserScores = async (username, count) => {
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

module.exports = fetchUserScores