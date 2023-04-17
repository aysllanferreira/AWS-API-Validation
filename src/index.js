'use strict';
const { dynamoDb } = require('./factory');
const {decoratorValidator} = require('./util');
const Handler = require('./handler');

const handler = new Handler({
  dynamoDBSvc: dynamoDb,
});

const heroesInsert = decoratorValidator(
  handler.main.bind(handler),
  Handler.validator(),
  'body'
);

const heroesTrigger = async (event) => {
  console.log('***event', JSON.stringify(event))
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v3.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports = {
  heroesTrigger,
  heroesInsert,
};