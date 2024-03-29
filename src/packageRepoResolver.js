const axios = require("axios");
const npa = require("npm-package-arg");
const hostedGitInfo = require("hosted-git-info");
const logger = require("./logger");

const npmjsUri = "https://registry.npmjs.org/";

const resolveGithubRepo = (packageName, packageVersion) => {
  const packageArgs = npa(`${packageName}@${packageVersion}`);

  switch (packageArgs.type) {
    case "hosted":
      return Promise.resolve(parseGitUrl(packageVersion));
    case "tag":
    case "version":
    case "range":
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
      return parseResult;
    } else {
      logger.debug(`${packageDefinition.name}: not a GitHub repository`);
    }
  } else {
    logger.debug(`${packageDefinition.name}: no repository specified`);
  }
  return null;
};

const getRepoFromNpm = (packageName) => {
  return axios
    .get(`${npmjsUri}${packageName}/`)
    .then((result) => result.data)
    .then(getRepoFromPackage)
    .catch((e) => {
      logger.debug(
        `${packageName}: does not exists in npmjs registry or not publicly accessible`
      );
      return null;
    });
};

const parseGitUrl = (gitUrl = "") => {
  const hostedInfo = hostedGitInfo.fromUrl(gitUrl);
  if (hostedInfo && hostedInfo.type === "github") {
    const username = hostedInfo.user.toLowerCase();
    const repository = hostedInfo.project.toLowerCase();
    return {
      username: username,
      repository: repository,
      fullName: `${username}/${repository}`,
    };
  }
  return null;
};

exports.resolveGithubRepo = resolveGithubRepo;
exports.getRepoFromPackage = getRepoFromPackage;
exports.parseGitUrl = parseGitUrl;
