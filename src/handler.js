const joi = require('@hapi/joi');
const {randomUUID} = require('node:crypto');

class Handler {
  constructor({ dynamoDBSvc }) {
    this.dynamoDBSvc = dynamoDBSvc;
    this.dynamoTable = 'Heroes';
  }

  static validator() {
    return joi.object({
      name: joi.string().max(100).min(2).required(),
      power: joi.string().max(20).min(2).required(),
    });
  }

  async main(event) {
    const data = event.body;
    const { error, value } = await Handler.validator().validate(
      data,
      {
        abortEarly: true,
      }
    );

    const params = this.prepareData(value);

    await this.dynamoDBSvc.put(params).promise();

    const insertedItem = await this.dynamoDBSvc
      .query({
        TableName: this.dynamoTable,
        ExpressionAttributeValues: {
          ':id': params.Item.id,
        },
        KeyConditionExpression: 'id = :id',
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(insertedItem, null, 2),
    };
  }

  prepareData(data) {
    return {
      TableName: 'Heroes',
      Item: {
        ...data,
        id: randomUUID(),
        createdAt: new Date().toISOString(),
      },
    };
  }
}

module.exports = Handler;