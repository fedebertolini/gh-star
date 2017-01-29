exports.githubPersonalToken = () => ({
    type: 'input',
    name: 'token',
    message: 'Enter your GitHub personal access token',
    validate: (value) => !!value && value.length >= 40,
});

exports.starRepos = (repos) => repos.map((repo, index) => ({
    type: 'confirm',
    name: index + 1,
    message: `Do you want to star ${repo.fullName}?`,
    default: true,
}));
