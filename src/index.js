const inquirer = require('inquirer');
const prompt = require('./prompt');
const githubClient = require('./githubClient');

inquirer.prompt(prompt.githubPersonalToken()).then(answer => {
    githubClient.tokenAuth(answer.token);
    return githubClient.getUser();
}).then((user) => {
    console.log(`Hello ${user.name}`);
    return githubClient.getStarred();
}).then((starred) => {
    console.log(starred);
}).catch(e => {
    console.log(e);
});
