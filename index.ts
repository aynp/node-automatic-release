import { readFileSync } from 'fs';
import * as core from '@actions/core';
import * as github from '@actions/github';

const token = core.getInput('token') || '';
const draft_release = core.getInput('draft_release') === 'true';
const generate_release_notes =
  core.getInput('generate_release_notes') === 'true';

const octokit = github.getOctokit(token);
const context = github.context;

async function main() {
  const { version: newVersion } = JSON.parse(
    readFileSync('package.json', 'utf8')
  );

  const { data } = await octokit.rest.repos.listReleases({
    ...context.repo,
    per_page: 1,
  });

  let previousVersion = '';

  if (data.length !== 0) {
    previousVersion = data[0].tag_name;
  }

  core.notice(`Previous version: ${previousVersion}`);
  core.notice(`New version: ${newVersion}`);

  if (previousVersion === newVersion) {
    core.setFailed(`Version did not change`);
    return;
  }

  // Publishing release
  try {
    core.notice(`Publishing release ${newVersion}`);
    octokit.rest.repos.createRelease({
      ...context.repo,
      tag_name: newVersion,
      name: newVersion,
      previous_tag_name: previousVersion,
      generate_release_notes: generate_release_notes,
      draft: draft_release,
    });
  } catch (err) {
    core.setFailed(`Failed to create a release. ${err}`);
  }
}

main();
