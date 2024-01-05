const fs = require('node:fs');
const path = require('node:path');
const { program } = require('commander');

program
	.requiredOption('-i, --input <path>', 'Input HAR path (required)')
	.option('-o, --output <path>', 'Output HAR path (optional)');

program.parse(process.argv);

let { input, output } = program.opts();

if (!output) {
	output = input;
}

input = path.resolve(input);
output = path.resolve(output);

const file = fs.readFileSync(input, {
	encoding: 'utf8'
});
const har = JSON.parse(file);

for (const entry of har.log.entries) {
	// * Fix failed CONNECT requests not having a scheme
	const requestURL = entry.request.url;

	if (
		!requestURL.startsWith('http://') &&
		!requestURL.startsWith('https://') &&
		// * Ignore WebSockets
		!requestURL.startsWith('ws://') &&
		!requestURL.startsWith('wss://')
	) {
		const port = requestURL.split(':').pop();
		const scheme = port === '443' ? 'https' : 'http';

		entry.request.url = `${scheme}://${requestURL}`;
	}

	// * Fix broken timings. Should be -1 when not applicable, not null
	const timings = entry.timings;

	for (const timing in timings) {
		if (timings[timing] === null) {
			timings[timing] = -1;
		}
	}
}

fs.writeFileSync(output, JSON.stringify(har, null, 4));