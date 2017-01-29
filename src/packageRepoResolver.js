const semverRegex = require('semver-regex');
const logger = require('./logger');
const httpsClient = require('./httpsClient');

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
            logger.debug(`${packageDefinition.name}: not a GitHub repository`);
        }
    } else {
        logger.debug(`${packageDefinition.name}: no repository specified`);
    }
    return null;
};

const getRepoFromNpm = (packageName) => {
    return httpsClient
        .get(npmjsUri, packageName + '/')
        .then(getRepoFromPackage)
        .catch(e => {
            logger.debug(`${packageName}: does not exists in npmjs registry or not publicly accessible`);
            return null;
        });
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
