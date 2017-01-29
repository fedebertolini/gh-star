#! /usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs');
const winston = require('winston');
const minimist = require('minimist');
const prompt = require('./prompt');
const parser = require('./packageParser');
const resolver = require('./packageRepoResolver');
const githubClient = require('./githubClient');

const args = minimist(process.argv.slice(2));
const path = process.cwd();

winston.level = args.v ? 'verbose' : 'info';

if (!fs.existsSync(`${path}/package.json`)) {
    winston.log('error', `Could not find a package.json file in ${path}`);
    return;
}

let starredRepos = {};
let unstarredRepos = [];

inquirer.prompt(prompt.githubPersonalToken()).then(answer => {
    githubClient.tokenAuth(answer.token);
    return githubClient.getUser();
}).then((user) => {
    winston.log('info', `Hello ${user.name}`);
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
    winston.log('info', 'The selected repos have been starred!');
}).catch(e => {
    winston.log('error', e);
});
