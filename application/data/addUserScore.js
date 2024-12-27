// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const { executeWriteSql } = require('./utils')
const redis = require('redis')

const client = redis.createClient({
  url: `redis://${process.env.REDIS_ENDPOINT}`
})
client.on('error', function(err) {
  console.log('Received Redis error:', err)
})

const addUserScore = async (username, level, score) => {
  sql = `INSERT INTO games (username, level, score) \
VALUES (:username, :level, :score)`
  parameters = [
    {
      name: 'username',
      value: { stringValue: username }
    },
    {
      name: 'level',
      value: { longValue: level}
    },
    {
      name: 'score',
      value: { longValue: score}
    }
  ]
  const result = await executeWriteSql(sql, parameters)
  const gametime = new Date()
  const key = `${username}|${gametime}|${level}`
  return new Promise((resolve, reject) => {
    client.multi()
      .zadd('Overall Leaderboard', score, key)
      .zadd(`Monthly Leaderboard|${gametime.getUTCMonth()}-${gametime.getUTCFullYear()}`, score, key)
      .zadd(`Daily Leaderboard|${gametime.getUTCDay()}-${gametime.getUTCMonth()}-${gametime.getUTCFullYear()}`, score, key)
      .exec((err) => {
        if (err) {
          reject(err)
        }
        resolve({ username, gametime, level, score })
      })
  })
}

module.exports = addUserScore
