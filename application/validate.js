// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const Joi = require('joi');

const extractError = (error) => {
  return error.details[0].message
}

// Request body validation for the POST /users endpoint
const validateCreateScore = (body) => {
  const schema = Joi.object().keys({
    level: Joi.number().integer().min(1).max(50).required(),
    score: Joi.number().integer().min(0).max(9999).required(),
  });

  const result = Joi.validate(body, schema);
  if (result.error) {
    return {
      valid: false,
      message: extractError(result.error)
    }
  }
  return {
    valid: true
  }
}

module.exports = {
  validateCreateScore
}