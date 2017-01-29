exports.githubPersonalToken = () => ({
    type: 'input',
    name: 'token',
    message: 'Enter your GitHub personal access token',
    validate: (value) => !!value && value.length >= 40,
});
