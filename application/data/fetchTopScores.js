// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const redis = require('redis')
const _ = require('lodash')
const client = redis.createClient({
  url: `redis://${process.env.REDIS_ENDPOINT}`
})

client.on('error', function(err) {
  console.log('Received Redis error:', err)
})

const parseKey = (key) => {
  const parts = key.split('|')
  return {
    username: parts[0],
    gamedate: parts[1],
    level: parts[2]
  }
}

const parseZRevRangeResponse = (resp) => {
  const result = _.chunk(resp, 2).map(([key, score]) => {
    const obj = parseKey(key)
    return {
      ...obj,
      score
    }
  })
  return result
}

const fetchTopScores = async (date) => {
  const gametime = new Date(date)
  return new Promise((resolve, reject) => {
    client.multi()
      .zrevrange('Overall Leaderboard', '0', '4', 'WITHSCORES')
      .zrevrange(`Monthly Leaderboard|${gametime.getUTCMonth()}-${gametime.getUTCFullYear()}`, '0', '4', 'WITHSCORES')
      .zrevrange(`Daily Leaderboard|${gametime.getUTCDay()}-${gametime.getUTCMonth()}-${gametime.getUTCFullYear()}`, '0', '4', 'WITHSCORES')
      .exec((err, resp) => {
        if (err) {
          reject(err)
        }
        const overall = parseZRevRangeResponse(resp[0])
        const weekly = parseZRevRangeResponse(resp[1])
        const daily = parseZRevRangeResponse(resp[2])
        resolve ({
          overall,
          weekly,
          daily
        })
      })
  })
}

module.exports = fetchTopScores
