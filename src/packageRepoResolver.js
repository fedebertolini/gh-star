const semverRegex = require('semver-regex');
const httpsClient = require('./httpsClient');

const debug = false;
const npmjsUri = 'https://registry.npmjs.org/';
const githubRegex = /github\.com\/([^/]+)\/([^/]+)\.git$/;

const resolveGithubRepo = (packageName, packageVersion) => {
    if (semverRegex().test(packageVersion)) {
        return getRepoFromNpm(packageName);
    }
    return Promise.resolve();
};

const getRepoFromPackage = (packageDefinition) => {
    const repo = packageDefinition.repository;
    if (repo) {
        const parseResult = parseGitUrl(repo.url);
        if (parseResult) {
            return  parseResult;
        } else {
            debug && console.log(`${packageDefinition.name}: not a GitHub repository`);
        }
    } else {
        debug && console.log(`${packageDefinition.name}: no repository specified`);
    }
    return null;
};

const getRepoFromNpm = (packageName) => {
    return httpsClient.get(npmjsUri, packageName + '/').then(getRepoFromPackage);
};

const parseGitUrl = (gitUrl) => {
    const regexResult = githubRegex.exec(gitUrl);
    if (regexResult) {
        return {
            username: regexResult[1],
            repository: regexResult[2],
            fullName: `${regexResult[1]}/${regexResult[2]}`,
        };
    }
    return null;
};

exports.resolveGithubRepo = resolveGithubRepo;
exports.getRepoFromPackage = getRepoFromPackage;
exports.parseGitUrl = parseGitUrl;
