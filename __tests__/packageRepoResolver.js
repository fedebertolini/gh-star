const { test } = require("uvu");
const assert = require("uvu/assert");
const resolver = require("../src/packageRepoResolver");

test("gets the repo.s url from the package definition", () => {
  const packageDefinition = {
    name: "gh-star",
    repository: {
      type: "git",
      url: "git+https://github.com/fedebertolini/gh-star.git",
    },
  };

  const repo = resolver.getRepoFromPackage(packageDefinition);
  assert.equal(repo, {
    fullName: "fedebertolini/gh-star",
    repository: "gh-star",
    username: "fedebertolini",
  });
});

test("parses valid git urls", () => {
  repos = [
    {
      url: "https://github.com/svg/svgo.git",
      fullName: "svg/svgo",
    },
    {
      url: "git+https://github.com/sboudrias/Inquirer.js.git",
      fullName: "sboudrias/inquirer.js",
    },
    {
      url: "git+https://github.com/fedebertolini/gh-star.git",
      fullName: "fedebertolini/gh-star",
    },
    {
      url: "https://github.com/svg/svgo",
      fullName: "svg/svgo",
    },
    {
      url: "git+https://github.com/sboudrias/Inquirer.js.git#v3.0.1",
      fullName: "sboudrias/inquirer.js",
    },
  ];

  repos.forEach((repo) => {
    const repoInfo = resolver.parseGitUrl(repo.url);
    assert.equal(repoInfo.fullName, repo.fullName);
  });
});

test("parses invalid git urls", () => {
  repos = [
    "https://bitbucket.org/simpletechs/node-safe-enum.git",
    "https://github.com/fedebertolini/",
  ];

  repos.forEach((url) => {
    assert.equal(resolver.parseGitUrl(url), null);
  });
});

test.run();
