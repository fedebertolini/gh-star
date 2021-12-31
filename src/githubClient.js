const { Octokit } = require("@octokit/rest");

let octokit;

exports.getUser = () => {
  return octokit.users
    .getAuthenticated()
    .then((result) => result.data)
    .catch((e) => Promise.reject("Authentication error"));
};

exports.getStarred = () =>
  octokit.paginate("GET /user/starred").then((result) => {
    const repos = {};
    result.forEach((item) => {
      repos[item.full_name.toLowerCase()] = true;
    });
    return repos;
  });

exports.starRepo = (repo) => {
  return octokit.rest.activity
    .starRepoForAuthenticatedUser({
      owner: repo.username,
      repo: repo.repository,
    })
    .catch((e) => Promise.reject(`${repo.fullName}: ${e.message}`));
};

exports.starGHStar = () =>
  module.exports.starRepo({
    username: "fedebertolini",
    repository: "gh-star",
    fullName: "fedebertolini/gh-star",
  });

exports.initClient = (token) => {
  octokit = new Octokit({
    protocol: "https",
    host: "api.github.com",
    followRedirects: false,
    request: {
      timeout: 5000,
    },
    auth: token,
  });
};
