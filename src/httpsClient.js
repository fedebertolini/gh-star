const https = require('https');
const url = require('url');

exports.get = (host, pathname, queryParameters) => {
    const requestUrl = url.format({
        host,
        pathname,
        query: queryParameters,
    });
    return new Promise((resolve, reject) => {
        https.get(requestUrl, (res) => {
            const statusCode = res.statusCode;

            if (statusCode !== 200) {
                res.resume();
                reject(`Request Failed. Status Code: ${statusCode}`);
            } else {
                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => {
                    rawData += chunk;
                });
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(rawData));
                    } catch (e) {
                        reject(`Error parsing response to JSON: ${e.message}`);
                    }
                });
                res.on('error', (e) => {
                    reject(`Error reading response: ${e.message}`);
                });
            }
        });
    });
};
0
