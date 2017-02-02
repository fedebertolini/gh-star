const npa = require('npm-package-arg');
const hostedGitInfo = require('hosted-git-info');
const logger = require('./logger');
const httpsClient = require('./httpsClient');

const npmjsUri = 'https://registry.npmjs.org/';
const githubRegex = /github\.com\/([^/]+)\/([^/]+)\.git(?:#\S*)?$/;

const resolveGithubRepo = (packageName, packageVersion) => {
    const packageArgs = npa(`${packageName}@${packageVersion}`);

    switch (packageArgs.type) {
        case 'hosted':
            return Promise.resolve(parseGitUrl(packageVersion));
        case 'tag':
        case 'version':
        case 'range':
            return getRepoFromNpm(packageName);
        default:
            return Promise.resolve(null);
    }
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

const parseGitUrl = (gitUrl = '') => {
    const hostedInfo = hostedGitInfo.fromUrl(gitUrl);
    if (hostedInfo && hostedInfo.type === 'github') {
        return {
            username: hostedInfo.user,
            repository: hostedInfo.project,
            fullName: `${hostedInfo.user}/${hostedInfo.project}`,
        };
    }
    return null;
};

exports.resolveGithubRepo = resolveGithubRepo;
exports.getRepoFromPackage = getRepoFromPackage;
exports.parseGitUrl = parseGitUrl;
