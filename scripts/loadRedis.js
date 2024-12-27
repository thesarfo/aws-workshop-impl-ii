// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const redis = require('redis')
const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync(path.resolve( __dirname, 'games.json'));
const games = JSON.parse(raw)

const client = redis.createClient({
  url: `redis://${process.env.REDIS_ENDPOINT}`
})
client.on('error', function(err) {
  console.log('Received Redis error:', err)
})

games.forEach((game) => {
  const gametime = new Date(game.gamedate)
  const key = `${game.username}|${game.gamedate}|${game.level}`
  client.multi()
    .zadd('Overall Leaderboard', game.score, key)
    .zadd(`Monthly Leaderboard|${gametime.getUTCMonth()}-${gametime.getUTCFullYear()}`, game.score, key)
    .zadd(`Daily Leaderboard|${gametime.getUTCDay()}-${gametime.getUTCMonth()}-${gametime.getUTCFullYear()}`, game.score, key)
    .exec((err) => {
      if (err) {
        console.log('Error: ', err);
      }
    })
})

console.log('Loaded data!')

client.quit()
