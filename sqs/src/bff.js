const querystring = require('querystring');
const { readFile } = require('fs').promises;
const { resolve } = require('path');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-southeast-2' });
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

exports.handler = async ({ body }) => {
	let response;
	if (body) {
		const submission = querystring.parse(Buffer.from(body, 'base64').toString('ascii'));
		console.dir(JSON.stringify(submission));
		await sqs.sendMessage({
			QueueUrl: process.env.QueueUrl,
			MessageBody: JSON.stringify(submission),
		}).promise();
		response = `<html><head><title>Thanks</title></head><body><h1>Thanks ${submission.name}</h1><hr />You'll get an email soon</body></html>`;
	} else {
		response = await readFile(resolve('index.html'), {encoding: 'ascii'});
	}
		return {
			headers: {
				'Content-Type': 'text/html',
			},
			statusCode: 200,
			body: response,
		};
};
