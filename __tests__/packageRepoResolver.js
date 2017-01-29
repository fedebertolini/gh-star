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
        const urlWithoutGitExt = 'https://github.com/svg/svgo';
        const urlWithTag = 'git+https://github.com/sboudrias/Inquirer.js.git#v3.0.1';
        const bitbuckerUrl = 'https://bitbucket.org/simpletechs/node-safe-enum.git';
        const malformedUrl = 'https://github.com/fedebertolini/';

        const svgoResult = resolver.parseGitUrl(svgo);
        const inquirerResult = resolver.parseGitUrl(inquirer);
        const ghStarResult = resolver.parseGitUrl(ghStar);
        const urlWithoutGitExtResult = resolver.parseGitUrl(urlWithoutGitExt);
        const urlWithTagResult = resolver.parseGitUrl(urlWithTag);
        const bitbuckerUrlResult = resolver.parseGitUrl(bitbuckerUrl);
        const malformedUrlResult = resolver.parseGitUrl(bitbuckerUrl);

        expect(svgoResult.fullName).toBe('svg/svgo');
        expect(inquirerResult.fullName).toBe('sboudrias/Inquirer.js');
        expect(ghStarResult.fullName).toBe('fedebertolini/gh-star');
        expect(urlWithoutGitExtResult.fullName).toBe('svg/svgo');
        expect(urlWithTagResult.fullName).toBe('sboudrias/Inquirer.js');
        expect(bitbuckerUrlResult).toBe(null);
        expect(malformedUrlResult).toBe(null);
    });
});
