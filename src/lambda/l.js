import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';



exports.handler = async (event, context) => {
	launchChromeAndRunLighthouse('https://irozhlas.cz', opts).then(results => {
		// Use results!
		console.log(results);
	});
};


function launchChromeAndRunLighthouse(url, opts, config = null) {
	return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
		opts.port = chrome.port;
		return lighthouse(url, opts, config).then(results => {
				// use results.lhr for the JS-consumable output
				// https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
				// use results.report for the HTML/JSON/CSV output as a string
				// use results.artifacts for the trace/screenshots/other specific case you need (rarer)
				return chrome.kill().then(() => results.lhr)
		});
	});


}

const opts = {
	chromeFlags: ['--no-sandbox --headless']
};

// Usage:
launchChromeAndRunLighthouse('https://irozhlas.cz', opts).then(results => {
	// Use results!
	console.log(results);

	return {
		statusCode: 200,
		body: results
	};
});