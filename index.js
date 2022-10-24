const core = require('@actions/core');
const github = require('@actions/github');

const token = core.getInput('token');
const draft = core.getInput('draft');
const generate_release_notes = core.getInput('generate_release_notes');

const octokit = github.getOctokit(token);
const context = github.context;

async function main() {
  const { newVersion } = require('./package.json');

  const { data } = await octokit.rest.repos.listReleases({
    ...context.repo,
    per_page: 1,
  });

  let previousVersion = '';

  if (data.length !== 0) {
    previousVersion = data[0].tag_name;
  }

  if (previousVersion === newVersion) {
    core.setFailed(`Version did not change`);
    return;
  }

  // Publishing release
  try {
    octokit.rest.repos.createRelease({
      ...context.repo,
      tag_name: newVersion,
      name: newVersion,
      previous_tag_name: previousVersion,
      generate_release_notes: generate_release_notes,
      draft: draft,
    });
  } catch (err) {
    core.setFailed(`Failed to create a release. ${err}`);
  }
}

main();
