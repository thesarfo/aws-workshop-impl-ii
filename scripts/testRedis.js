// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const redis = require('redis')
const client = redis.createClient({
  url: `redis://${process.env.REDIS_ENDPOINT}`
})

client.on('error', function(err) {
  console.log('Received Redis error:', err)
})

client.ping((err, resp) => {
  if (err) {
    console.log('Error doing ping: ', err);
  } else {
    console.log('Successful ping!', resp)
  }
  client.quit()
})