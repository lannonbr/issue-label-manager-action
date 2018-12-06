const { Toolkit } = require("actions-toolkit");
const fs = require("fs");
const path = require("path");
const tools = new Toolkit();
const octokit = tools.createOctokit();

async function run() {
  let response = await octokit.issues.listLabelsForRepo(tools.context.repo());
  let labels = response.data;

  let url = path.join(
    process.env["GITHUB_WORKSPACE"],
    ".github",
    "labels.json"
  );

  let newLabels = JSON.parse(fs.readFileSync(url).toString());

  newLabels.forEach(async label => {
    let { name, color, description } = label;

    let idx = labels.indexOf(issue => issue.name === name);

    if (idx !== -1) {
      let params = tools.context.repo({
        current_name: name,
        color,
        description,
        headers: { accept: "application/vnd.github.symmetra-preview+json" }
      });
      await octokit.issues.updateLabel(params);
      labels = labels.splice(idx, 1);
    } else {
      let params = tools.context.repo({
        name,
        color,
        description,
        headers: { accept: "application/vnd.github.symmetra-preview+json" }
      });
      await octokit.issues.createLabel(params);
    }
  });

  // Delete labels that exist on GitHub that aren't in labels.json
  labels.forEach(async label => {
    let { name } = label;

    let params = tools.context.repo({ name });

    await octokit.issues.deleteLabel(params);
  });
}

run();
