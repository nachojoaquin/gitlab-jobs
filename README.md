WARNING: Still in alpha stage

# GitLab Jobs
Dynamic GitLab pipeline configuration using Javascript

## Benefits
* Re-use of common pipeline logic. Specially important when managing several projects with common stages and jobs.
* Allows semantic versioning of those common pieces by packing them as npm modules, thus allowing for your pipelines to continuously evolve, without breaking.
* Familiar syntax for common programming constructs (functions, loops), that otherwise are complex o impossible using yml imports.

## Features
* Library of common GitLab pipeline constructs (stage, job, etc)
* Automaticaly reads common GitLab environment variables
* Validates output

## How it works
GitLab has just released the ability for pipelines to generate a .gitlab-ci.yml file (https://gitlab.com/gitlab-org/gitlab/issues/35632) and to use it in a "triggered" pipeline, therefore opening the possibility to have dynamic jobs. This library will provides an easy API to generate that yml.

Your actual piplene is defined in `.gitlab-ci.js` (note the `.js` extension).
This can be as simple as:

``` js
// A sample pre-built pipeline with testing, linting and deployment to Heroku
const expressHerokuPipeline = require('@gitlab-jobs/express-heroku-pipeline');
module.exports = expressStarterPipeline(); 
```

You can further refine your pipeline with customizations, like so:
``` js
const {
    pipeline,
    stage,
    job,
    nodeInitStage,
    mochaTestJob,
} = require('gitlab-jobs');

module.exports = pipeline({
    stages: [
        nodeInitStage(), // Pre-defined stage, has jobs within
        stage('test', {
            jobs: [mochaTestJob()]
        }),
        stage('publish', {
            jobs: [job('npm-publish', {
                script: 'npm publish'
            })]
        })
    ]
});
```


For all this to work you need to configure your `.gitlab-ci.yml` as follows:

```yaml
generate-config:
  stage: build
  script:
    - npm install
    - ./node_modules/gitlab-jobs/bin/gitlab-jobs generate > generated-config.yml
  artifacts:
    paths:
      - generated-config.yml

child-pipeline:
  stage: test
  trigger:
    include:
      - artifact: generated-config.yml
        job: generate-config
```

# TODO:
- Create bin file to use as generator
- Review possible API, based on current .gitlab-ci.yml
- Examples of common tasks, like branch-based deployment targets
- Test how generated yml actually work, create an example
- Support Async API