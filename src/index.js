const parser = require('./packageParser');

const result = parser.parsePackage('../package.json');

console.log(result);
