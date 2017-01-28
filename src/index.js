const parser = require('./packageParser');
const resolver = require('./packageRepoResolver');

const result = parser.parsePackage('../package.json');

result.forEach(packageInfo => {
    resolver.resolveGithubRepo(packageInfo.name, packageInfo.version).then(url => {
        console.log(url);
    });
});
