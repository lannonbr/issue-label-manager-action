from node:10-slim

LABEL version="1.0.0"
LABEL repository="https://github/lannonbr/issue-label-manager-action"
LABEL maintainer="Benjamin Lannon <benjamin@lannonbr.com>"

LABEL com.github.actions.name="Issue Label Manager Action"
LABEL com.github.actions.description="Will update repo's labels based on data in JSON file located at $REPO/.github/labels.json"
LABEL com.github.actions.icon="upload"
LABEL com.github.actions.color="green"

ADD package.json /package.json
ADD package-lock.json /package-lock.json
WORKDIR /
COPY . /

RUN npm i

ENTRYPOINT ["node", "/index.js"]