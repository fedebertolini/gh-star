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

    it('parses git urls', () => {
        const svgo = 'https://github.com/svg/svgo.git';
        const inquirer = 'git+https://github.com/sboudrias/Inquirer.js.git';
        const ghStar = 'git+https://github.com/fedebertolini/gh-star.git';
        const invalidUrl = 'https://github.com/svg/svgo/';

        const svgoResult = resolver.parseGitUrl(svgo);
        const inquirerResult = resolver.parseGitUrl(inquirer);
        const ghStarResult = resolver.parseGitUrl(ghStar);
        const invalidUrlResult = resolver.parseGitUrl(invalidUrl);

        expect(svgoResult.fullName).toBe('svg/svgo');
        expect(inquirerResult.fullName).toBe('sboudrias/Inquirer.js');
        expect(ghStarResult.fullName).toBe('fedebertolini/gh-star');
        expect(invalidUrlResult).toBe(null);
    });
});
