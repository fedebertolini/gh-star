#! /usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs');
const minimist = require('minimist');
const logger = require('./logger');
const prompt = require('./prompt');
const parser = require('./packageParser');
const resolver = require('./packageRepoResolver');
const githubClient = require('./githubClient');

const args = minimist(process.argv.slice(2));
const path = process.cwd();

if (args.v) {
    logger.setVerbosity(true);
};

if (!fs.existsSync(`${path}/package.json`)) {
    logger.error(`Could not find a package.json file in ${path}`);
    return;
}

let starredRepos = {};
const promises = [];

const promptStarRepoQuestion = (repositories) => {
    if (repositories.length === 0) {
        return true;
    }
    const repo = repositories[0];
    return inquirer.prompt(prompt.starRepo(repo.fullName, 'star')).then((answer) => {
        if (answer.star) {
            promises.push(githubClient.starRepo(repo));
        }
        return promptStarRepoQuestion(repositories.slice(1));
    });
};

inquirer.prompt(prompt.githubPersonalToken()).then(answer => {
    githubClient.initClient(answer.token);
    return githubClient.getUser();
}).then((user) => {
    logger.info(`Hello ${user.name}`);
    return githubClient.getStarred();
}).then((starred) => {
    starredRepos = starred;
    const packageDefinition = parser.parsePackage(`${path}/package.json`);
    return Promise.all(packageDefinition.map(p => {
        return resolver.resolveGithubRepo(p.name, p.version);
    }));
}).then((repositories) => {
    const unstarredRepos = repositories.filter(repo => {
        return !!repo && !starredRepos[repo.fullName];
    });

    if (unstarredRepos.length) {
        return promptStarRepoQuestion(unstarredRepos).then(() => {
            return Promise.all(promises);
        }).then(() => {
            return inquirer.prompt(prompt.starGHStar('star'));
        }).then((answer) => {
            if (answer.star) {
                return githubClient.starGHStar();
            }
        }).then(() => {
            logger.info('The selected repos have been starred!');
        });
    } else {
        logger.info('All repos are already starred');
    }
}).catch(e => {
    logger.error(e);
});
