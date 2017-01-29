let verbose = false;

exports.setVerbosity = (verbosity = false) => {
    verbose = verbosity;
};

exports.info = (message) => {
    console.log(message);
};

exports.error = (message) => {
    console.log(message);
};

exports.debug = (message) => {
    verbose && console.log(message);
};
