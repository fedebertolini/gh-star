# :star: gh-star :star:
Share the love with the developers of your favorite GitHub repos!
Execute this global node module in your root project folder to
add a star to the GitHub repositories in your `package.json`'s
dependencies.

## Installation
```
npm install gh-star -g
```

## Usage
Since **gh-star** impersonates you for starring repositories, you
need to provide a [Github Personal Access Token](https://github.com/settings/tokens).
You can [get an access token by following this instructions](https://help.github.com/articles/creating-an-access-token-for-command-line-use/).
The only required scope for the access token is `public_repo`.

In your project folder where the `package.json` file is located run
```
gh-star
```

You will be prompted for you personal access token. Then **gh-star**
will parse the `package.json` file, search each dependency in the
[npm-registry](https://registry.npmjs.org/) and get their GitHub url
(if any). The last step is to select which repositories you would like
to star :tada:.
