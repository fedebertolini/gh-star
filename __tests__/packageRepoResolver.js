const resolver = require('../src/packageRepoResolver');

describe('package repo resolver', () => {
    it('gets the repo\.s url from the package definition', () => {
        const packageDefinition = {
            name: 'gh-star',
            repository: {
                type: 'git',
                url: 'git+https://github.com/fedebertolini/gh-star.git',
            },
        };

        const repo = resolver.getRepoFromPackage(packageDefinition);
        expect(repo).toEqual({
            fullName: 'fedebertolini/gh-star',
            repository: 'gh-star',
            username: 'fedebertolini',
        });
    });

    it('parses valid git urls', () => {
        repos = [{
            url: 'https://github.com/svg/svgo.git',
            fullName: 'svg/svgo',
        }, {
            url: 'git+https://github.com/sboudrias/Inquirer.js.git',
            fullName: 'sboudrias/Inquirer.js',
        }, {
            url: 'git+https://github.com/fedebertolini/gh-star.git',
            fullName: 'fedebertolini/gh-star',
        }, {
            url: 'https://github.com/svg/svgo',
            fullName: 'svg/svgo',
        }, {
            url: 'git+https://github.com/sboudrias/Inquirer.js.git#v3.0.1',
            fullName: 'sboudrias/Inquirer.js',
        }];

        repos.forEach(repo => {
            const repoInfo = resolver.parseGitUrl(repo.url);
            expect(repoInfo.fullName).toBe(repo.fullName);
        });
    });

    it('parses invalid git urls', () => {
        repos = [
            'https://bitbucket.org/simpletechs/node-safe-enum.git',
            'https://github.com/fedebertolini/',
        ];

        repos.forEach(url => {
            expect(resolver.parseGitUrl(url)).toBe(null);
        });
    });
});
