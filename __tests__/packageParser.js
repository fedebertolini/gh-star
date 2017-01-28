const parser = require('../src/packageParser');

describe('package parser', () => {
    it('returns an ordered array of the package\'s production dependencies', () => {
        const result = parser.parsePackage({
            name: 'gh-star',
            version: '0.0.1',
            dependencies: {
                'npm-registry-client': '^7.4.5',
                'octonode': '^0.7.8'
            },
        });

        expect(result).toEqual([
            {
                name: 'npm-registry-client',
                version: '^7.4.5',
            },
            {
                name: 'octonode',
                version: '^0.7.8',
            },
        ]);
    });

    it('returns an ordered array of the package\'s dev dependencies', () => {
        const result = parser.parsePackage({
            name: 'gh-star',
            version: '0.0.1',
            devDependencies: {
                'jest': '^18.1.0',
                'eslint-loader': '^1.6.1',
                'eslint': '^3.13.0',
                'eslint-config-airbnb-base': '^11.0.0'
            },
        });

        expect(result).toEqual([
            {
                name: 'eslint',
                version: '^3.13.0',
            },
            {
                name: 'eslint-config-airbnb-base',
                version: '^11.0.0',
            },
            {
                name: 'eslint-loader',
                version: '^1.6.1',
            },
            {
                name: 'jest',
                version: '^18.1.0',
            },
        ]);
    });

    it('returns an ordered array of all the package\'s dependencies', () => {
        const result = parser.parsePackage({
            name: 'gh-star',
            version: '0.0.1',
            dependencies: {
                'npm-registry-client': '^7.4.5',
                'octonode': '^0.7.8'
            },
            devDependencies: {
                'jest': '^18.1.0',
                'eslint-loader': '^1.6.1',
                'eslint': '^3.13.0',
                'eslint-config-airbnb-base': '^11.0.0'
            },
        });

        expect(result).toEqual([
            {
                name: 'eslint',
                version: '^3.13.0',
            },
            {
                name: 'eslint-config-airbnb-base',
                version: '^11.0.0',
            },
            {
                name: 'eslint-loader',
                version: '^1.6.1',
            },
            {
                name: 'jest',
                version: '^18.1.0',
            },
            {
                name: 'npm-registry-client',
                version: '^7.4.5',
            },
            {
                name: 'octonode',
                version: '^0.7.8',
            },
        ]);
    });

    it('parses this project\'s package.json', () => {
        const result = parser.parsePackage('../package.json');

        expect(typeof result).toBe('object');
        expect(result.length).toBeGreaterThan(2);
    });
});
