const inquirer = require('inquirer');
const fs = require('fs');
const prompt = require('./prompt');
const parser = require('./packageParser');
const resolver = require('./packageRepoResolver');
const githubClient = require('./githubClient');
const path = process.cwd();

if (!fs.existsSync(`${path}/package.json`)) {
    console.log(`Could not find a package.json file in ${path}`);
    return;
}

let starredRepos = {};
let unstarredRepos = [];

inquirer.prompt(prompt.githubPersonalToken()).then(answer => {
    githubClient.tokenAuth(answer.token);
    return githubClient.getUser();
}).then((user) => {
    console.log(`Hello ${user.name}`);
    return githubClient.getStarred();
}).then((starred) => {
    starredRepos = starred;
    const packageDefinition = parser.parsePackage(`${path}/package.json`);
    return Promise.all(packageDefinition.map(p => {
        return resolver.resolveGithubRepo(p.name, p.version);
    }));
}).then((repositories) => {
    unstarredRepos = repositories.filter(repo => {
        return !!repo && !starredRepos[repo.fullName];
    });
    return inquirer.prompt(prompt.starRepos(unstarredRepos));
}).then((answers) => {
    const repos = unstarredRepos.filter((repo, index) => answers[index + 1]);
    return githubClient.starRepos(repos);
}).then(() => {
    console.log('The selected repos have been starred!');
}).catch(e => {
    console.log(e);
});
