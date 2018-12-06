# Issue Label Manager Action

This GitHub Action allows you to declaratively state the labels to be defined in a repo.

In the repo you'd like to use this, define a JSON file in `.github/labels.json`. This file will contain an array of objects that have a name, color, and description as shown in the example below.

![labels.json file](screenshots/json.png)

Then, set up a workflow that executes this action. When run, it will update the list of labels in the repo to match the JSON file and will delete any other labels.

The result of using the labels.json file shown above is as follows:

![Labels result](screenshots/labels.png)
