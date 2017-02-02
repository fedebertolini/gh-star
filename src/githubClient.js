const GitHubApi = require('github');

const github = new GitHubApi({
    protocol: 'https',
    host: 'api.github.com',
    followRedirects: false,
    timeout: 5000
});

exports.getUser = () => {
    return github.users.get({}).catch(e => Promise.reject('Authentication error'));
};

exports.getStarred = () => {
    let starred = [];

    const pager = (result) => {
        starred = starred.concat(result);
        if (github.hasNextPage(result)) {
            return github.getNextPage(result).then(pager);
        }
        return starred;
    };
    const param = { per_page: 100 };

    return github.activity
        .getStarredRepos(param)
        .then(pager)
        .then(result => {
            const repos = {};
            result.forEach(item => {
                repos[item.full_name] = true;
            });
            return repos;
        });
};

exports.starRepo = (repo) => {
    return github.activity.starRepo({
        owner: repo.username,
        repo: repo.repository,
    }).catch(e => Promise.reject(`${repo.fullName}: ${e.message}`));
};

exports.tokenAuth = (token) => {
    github.authenticate({
        type: "oauth",
        token: token,
    });
};
