const fetch = require("node-fetch");

module.exports = function gitlabCiValidate(yml, options = {}) {
  if (!options.host) {
    options.host = "https://gitlab.com";
  }
  const headers = { "Content-Type": "application/json" };
  if (options.private_token) {
    headers["Private-Token"] = options.private_token;
  }
  // eslint-disable-next-line no-undef
  return fetch(`${options.host}/api/v4/ci/lint`, {
    method: "POST",
    json: true,
    headers,
    body: JSON.stringify({
      content: yml
    })
  }).then(res => res.json());
};
