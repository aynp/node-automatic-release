const core = require('@actions/core');
const github = require('@actions/github');

const token = core.getInput('token');

const octokit = github.getOctokit(token);
const context = github.context;

async function main() {
  const { newVersion } = require('./package.json');

  const { data } = await octokit.rest.repos.listReleases({
    ...context.repo,
    per_page: 1,
  });

  console.log(data);

  if (data.length === 0) console.log('Initial Release');

  octokit.rest.repos.createRelease({
    ...context.repo,
    tag_name: newVersion,
    draft: true,
  });
}

main();
