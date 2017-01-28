const resolver = require('../src/packageRepoResolver');

describe('package repo resolver', () => {
    it('gets the repo\.s url from the package definition', () => {
        const packageDefinition = {
            name: 'gh-star',
            repository: {
                type: 'git',
                url: 'git+https://github.com/fedebertolini/gh-star.git',
            }
        };

        const url = resolver.getRepoUrlFromPackage(packageDefinition);
        expect(url).toBe('git+https://github.com/fedebertolini/gh-star.git');
    });
});
