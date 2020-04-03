const gitlabCiValidate = require("../lib/gitlabCiValidate");
const YAML = require("yaml");
const {
  pipeline,
  stage,
  job,
  nodeInitStage,
  mochaTestJob
} = require("../lib/index");

const testPipeline = pipeline({
  stages: [
    nodeInitStage(), // Pre-defined stage, has jobs within
    stage("test", {
      jobs: [mochaTestJob()]
    }),
    stage("publish", {
      jobs: [
        job("npm-publish", {
          script: "npm publish"
        })
      ]
    })
  ]
});

const parsedPipeline = YAML.parse(testPipeline);
console.assert(parsedPipeline.stages);
console.assert(parsedPipeline.stages.length === 4);
(async () => {
  const result = await gitlabCiValidate(testPipeline);
  console.assert((result.status = "valid"));
})();
