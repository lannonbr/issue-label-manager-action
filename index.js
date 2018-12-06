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

  console.log({ newLabels });

  newLabels.forEach(async label => {
    let { name, color, description } = label;

    if (labels.some(issue => issue.name === name)) {
      let params = tools.context.repo({
        current_name: name,
        color,
        description,
        headers: { accept: "application/vnd.github.symmetra-preview+json" }
      });
      await octokit.issues.updateLabel(params);
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
}

run();
