const querystring = require('querystring');

exports.handler = async ({ body }) => ({
	headers: {
		'Content-Type': 'application/json',
	},
	statusCode: 200,
	body: JSON.stringify({
		received: querystring.parse(body),
	})
});
