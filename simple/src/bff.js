const querystring = require('querystring');
const { readFile } = require('fs').promises;
const { resolve } = require('path');

exports.handler = async ({ body }) => {
	let response;
	if (body) {
		const submission = querystring.parse(Buffer.from(body, 'base64').toString('ascii'));
		console.dir(JSON.stringify(submission));
		response = `<html><head><title>Thanks</title></head><body><h1>Thanks ${submission.name}</h1></body></html>`;
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
