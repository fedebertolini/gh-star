exports.githubPersonalToken = () => ({
    type: 'input',
    name: 'token',
    message: 'Enter your GitHub personal access token',
    validate: (value) => !!value && value.length >= 40,
});

exports.starRepo = (repoName, questionName) => ({
    type: 'confirm',
    name: questionName,
    message: `Do you want to star ${repoName}?`,
    default: true,
});
