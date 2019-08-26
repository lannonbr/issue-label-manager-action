const fs = require("fs");
const path = require("path");
const github = require("@actions/github");

const accessToken = process.env.GITHUB_TOKEN;
const octokit = new github.GitHub(accessToken);

async function run() {
  let newLabelsUrl = path.join(
    process.env["GITHUB_WORKSPACE"],
    ".github",
    "labels.json"
  );

  let liveLabels = await getCurrentLabels();
  let newLabels = JSON.parse(fs.readFileSync(newLabelsUrl).toString());

  // If the color of a label has a # sign, remove it
  newLabels.forEach(newLabel => {
    if (newLabel.color[0] === "#") {
      newLabel.color = newLabel.color.slice(1);
    }
  });

  let labelModList = diffLabels(liveLabels, newLabels);

  labelModList.forEach(async mod => {
    if (mod.type === "create") {
      let params = {
        ...github.context.repo,
        name: mod.label.name,
        color: mod.label.color,
        description: mod.label.description,
        previews: ["symmetra"]
      };
      console.log(`[Action] Creating Label: ${mod.label.name}`);

      await octokit.issues.createLabel(params);
    } else if (mod.type === "update") {
      let params = {
        ...github.context.repo,
        current_name: mod.label.name,
        color: mod.label.color,
        description: mod.label.description,
        previews: ["symmetra"]
      };
      console.log(`[Action] Updating Label: ${mod.label.name}`);

      await octokit.issues.updateLabel(params);
    } else if (mod.type === "delete") {
      let params = {
        ...github.context.repo,
        name: mod.label.name
      };
      console.log(`[Action] Deleting Label: ${mod.label.name}`);

      await octokit.issues.deleteLabel(params);
    }
  });
}

async function getCurrentLabels() {
  let response = await octokit.issues.listLabelsForRepo({
    ...github.context.repo,
    previews: ["symmetra"]
  });
  let data = response.data;

  return data;
}

function diffLabels(oldLabels, newLabels) {
  // Return diff which includes
  // 1) New labels to be created
  // 2) Labels that exist but have an update
  // 3) Labels that no longer exist and should be deleted

  // each entry has two values
  // { type: 'create' | 'update' | 'delete', label }

  let oldLabelsNames = oldLabels.map(label => label.name);
  let newLabelsNames = newLabels.map(label => label.name);

  let labelModList = [];

  oldLabelsNames.forEach(oLabel => {
    if (newLabelsNames.includes(oLabel)) {
      const oldLabel = oldLabels.filter(l => l.name === oLabel)[0];
      const newLabel = newLabels.filter(l => l.name === oLabel)[0];

      if (
        oldLabel.color !== newLabel.color ||
        oldLabel.description !== newLabel.description
      ) {
        // UPDATE
        labelModList.push({ type: "update", label: newLabel });
      }
      newLabelsNames = newLabelsNames.filter(element => {
        return element !== oLabel;
      });
    } else {
      // DELETE
      const oldLabel = oldLabels.filter(l => l.name === oLabel)[0];

      labelModList.push({ type: "delete", label: oldLabel });
    }
  });

  newLabelsNames.forEach(nLabel => {
    const newLabel = newLabels.filter(l => l.name === nLabel)[0];

    // CREATE
    labelModList.push({ type: "create", label: newLabel });
  });

  return labelModList;
}

run();
