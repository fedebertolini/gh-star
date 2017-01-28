const semverRegex = require('semver-regex');
const httpsClient = require('./httpsClient');

const npmjsUri = 'https://registry.npmjs.org/';

const resolveGithubRepo = (packageName, packageVersion) => {
    if (semverRegex().test(packageVersion)) {
        return getRepoFromNpm(packageName);
    }
    console.log('semver not ok :' + packageVersion);
    return Promise.resolve();
};

const getRepoUrlFromPackage = (packageDefinition) => {
    const repo = packageDefinition.repository;
    if (repo) {
        if (repo.type === 'git' && repo.url.includes('github.com')) {
            return repo.url;
        } else {
            console.log(`${packageDefinition.name}: not a GitHub repository`);
        }
    } else {
        console.log(`${packageDefinition.name}: does not have a repository`);
    }
    return null;
};

const getRepoFromNpm = (packageName) => {
    return httpsClient.get(npmjsUri, packageName + '/')
        .then(getRepoUrlFromPackage);
};

exports.resolveGithubRepo = resolveGithubRepo;
exports.getRepoUrlFromPackage = getRepoUrlFromPackage;
