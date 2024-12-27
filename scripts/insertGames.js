// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const AWS = require('aws-sdk')

const rdsdataservice = new AWS.RDSDataService();
const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync(path.resolve( __dirname, 'games.json'));
const games = JSON.parse(raw)
const values = games.map((game) => { return `('${game.username}', '${game.gamedate}', ${game.score}, ${game.level})`}).join(',\n')
const sql = `INSERT INTO games (username, gamedate, score, level) VALUES ${values}`

const params = {
  resourceArn: process.env.DATABASE_ARN,
  secretArn: process.env.SECRET_ARN,
  database: 'leaderboard',
  sql
}

rdsdataservice.executeStatement(params, function(err, data) {
  if (err) {
    console.log(err, err.stack)
  } else {
    console.log('Games inserted successfully!')
  }
})
