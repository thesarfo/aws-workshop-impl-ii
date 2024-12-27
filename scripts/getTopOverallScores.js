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

client.zrevrange('Overall Leaderboard', '0', '4', 'WITHSCORES', (err, resp) => {
  if (err) {
    console.log('Error reading leaderboard: ', err);
  } else {
    const scores = parseZRevRangeResponse(resp)
    console.log('Top overall scores:')
    console.log(scores)
  }
})

client.quit()
