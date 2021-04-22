exports.handler = async ({ Records: [ { body } ] }) => {
	console.log(`${process.env.WorkerRole} processing ${body}`);
};
