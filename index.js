const { Toolkit } = require("actions-toolkit");
const fs = require("fs");
const path = require("path");

const tools = new Toolkit();
const octokit = tools.createOctokit();

async function run() {
  // Get current labels on GitHub
  let response = await octokit.issues.listLabelsForRepo(tools.context.repo());
  let labels = response.data;

  let url = path.join(
    process.env["GITHUB_WORKSPACE"],
    ".github",
    "labels.json"
  );

  // Get the labels to be pushed from the labels.json file
  let newLabels = JSON.parse(fs.readFileSync(url).toString());

  let indexesOfLabelsToBeRemovedFromArray = await Promise.all(
    newLabels.map(async label => {
      return new Promise(async resolve => {
        let { name, color, description } = label;

        let idx = -1;

        if (labels.length > 0) {
          idx = labels.findIndex(issue => issue.name === name);
        }

        if (idx !== -1) {
          let params = tools.context.repo({
            current_name: name,
            color,
            description,
            headers: { accept: "application/vnd.github.symmetra-preview+json" }
          });
          await octokit.issues.updateLabel(params);
          resolve(idx);
        } else {
          let params = tools.context.repo({
            name,
            color,
            description,
            headers: { accept: "application/vnd.github.symmetra-preview+json" }
          });
          await octokit.issues.createLabel(params);
          resolve(-1);
        }
      });
    })
  );

  // Filter labels array to include labels not defined in json file
  labels = labels.filter((_, idx) => {
    return !indexesOfLabelsToBeRemovedFromArray.includes(idx);
  });

  // Delete labels that exist on GitHub that aren't in labels.json
  labels.forEach(async label => {
    let { name } = label;

    let params = tools.context.repo({ name });

    await octokit.issues.deleteLabel(params);
  });
}

run();
