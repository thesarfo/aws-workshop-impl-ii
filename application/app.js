// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const express = require('express')
const bodyParser = require('body-parser')
const { fetchUserScores, addUserScore, fetchTopScores } = require('./data')
const { createCognitoUser, login, verifyToken } = require('./auth')
const { validateCreateScore } = require('./validate')

const app = express()
app.use(bodyParser.json())

function wrapAsync(fn) {
  return function(req, res, next) {
    fn(req, res, next).catch(next);
  };
}
// Login
app.post('/login', wrapAsync(async (req, res) => {
  const idToken = await login(req.body.username, req.body.password)
  res.json({ idToken })
}))

// Create user
app.post('/users', wrapAsync(async (req, res) => {
  await createCognitoUser(req.body.username, req.body.password, req.body.email)
  res.json({ username: req.body.username })
}))

// Fetch user scores
app.get('/users/:username', wrapAsync(async (req, res) => {
  const limit = req.query.limit || 10;
  const scores = await fetchUserScores(req.params.username, limit)
  res.json(scores)
}))

// Add new score
app.post('/users/:username', wrapAsync(async (req, res) => {
  const validated = validateCreateScore(req.body)
  if (!validated.valid) {
    throw new Error(validated.message)
  }
  const token = await verifyToken(req.header('Authorization'))
  if (token['cognito:username'] != req.params.username) {
    throw new Error('Unauthorized')
  }
  const score = await addUserScore(req.params.username, req.body.level, req.body.score)
  res.json(score)
}))

// Fetch top scores
app.get('/scores/:date', wrapAsync(async (req, res) => {
  const scores = await fetchTopScores(req.params.date)
  res.json(scores)
}))

app.use(function(error, req, res, next) {
  res.status(400).json({ message: error.message });
});

module.exports = app
