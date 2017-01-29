const logger = require('./logger');

exports.parsePackage = (file = './package.json') => {
    let packageObject;
    if (typeof file === 'string') {
        packageObject = getFile(file);
    } else if (typeof file === 'object') {
        packageObject = file;
    }

    const prodDependencies = parseDependenciesObject(packageObject.dependencies);
    const devDependencies = parseDependenciesObject(packageObject.devDependencies);
    const dependencies = prodDependencies.concat(devDependencies);

    return dependencies.sort((d1, d2) => compareStrings(d1.name, d2.name));
}

const compareStrings = (str1, str2) => {
    if (str1 < str2) {
        return -1;
    } else if (str1 > str2) {
        return 1;
    }
    return 0;
}

const parseDependenciesObject = (obj) => {
    const result = [];
    if (obj) {
        for (key in obj) {
            result.push({
                name: key,
                version: obj[key],
            });
        }
    }
    return result;
};

const getFile = (filePath) => {
    try {
        return require(filePath);
    } catch (e) {
        logger.error('Error parsing package.json file', e);
        return {};
    }
};
