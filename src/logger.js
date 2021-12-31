const kleur = require("kleur");

let verbose = false;

exports.setVerbosity = (verbosity = false) => {
  verbose = verbosity;
};

exports.info = (message) => {
  console.log(kleur.green(message));
};

exports.error = (message) => {
  console.log(kleur.red(message));
};

exports.debug = (message) => {
  verbose && console.log(kleur.yellow(message));
};
