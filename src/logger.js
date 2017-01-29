const colors = require('colors/safe');

let verbose = false;

exports.setVerbosity = (verbosity = false) => {
    verbose = verbosity;
};

exports.info = (message) => {
    console.log(colors.green(message));
};

exports.error = (message) => {
    console.log(colors.red(message));
};

exports.debug = (message) => {
    verbose && console.log(colors.yellow(message));
};
