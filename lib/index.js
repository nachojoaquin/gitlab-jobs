const YAML = require("yaml");

function nodeInitStage() {
  return stage("init", {
    jobs: [
      job("install", {
        script: "npm install"
      })
    ]
  });
}
function mochaTestJob() {
  return job("mocha", {
    script: "mocha ."
  });
}
function stage(name, options) {
  return {
    name,
    ...options
  };
}
function job(name, options) {
  return {
    name,
    options
  };
}
function pipeline(options) {
  const pipeline = {
    stages: []
  };
  options.stages.forEach(stage => {
    console.log(stage);
    pipeline.stages.push(stage.name);
    stage.jobs.forEach(job => {
      pipeline[job.name] = job.options;
      pipeline[job.name].stage = stage.name;
    });
  });
  return YAML.stringify(pipeline);
}

module.exports = {
  pipeline,
  stage,
  job,
  nodeInitStage,
  mochaTestJob
};
