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

  console.log({ newLabels, labels });

  let idxs = await Promise.all(
    newLabels.forEach(async label => {
      return new Promise(async resolve => {
        let { name, color, description } = label;

        let idx = -1;

        if (labels.length > 0) {
          idx = labels.findIndex(issue => issue.name === name);
        }

        console.log({ idx });

        if (idx !== -1) {
          let params = tools.context.repo({
            current_name: name,
            color,
            description,
            headers: { accept: "application/vnd.github.symmetra-preview+json" }
          });
          console.log("UPDATE");
          await octokit.issues.updateLabel(params);
          resolve(idx);
        } else {
          let params = tools.context.repo({
            name,
            color,
            description,
            headers: { accept: "application/vnd.github.symmetra-preview+json" }
          });
          console.log("CREATE");
          await octokit.issues.createLabel(params);
          resolve(-1);
        }
      });
    })
  );

  labels = labels.filter((_, idx) => {
    return !idxs.includes(idx);
  });

  // Delete labels that exist on GitHub that aren't in labels.json
  labels.forEach(async label => {
    let { name } = label;

    let params = tools.context.repo({ name });

    await octokit.issues.deleteLabel(params);
  });
}

run();
