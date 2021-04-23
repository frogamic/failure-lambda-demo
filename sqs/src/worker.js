const failureLambda = require('failure-lambda');

exports.handler = failureLambda(async ({ Records: [ { body } ] }) => {
	console.log(`${process.env.WorkerRole} processing ${body}`);
});
