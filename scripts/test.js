const fs = require('fs');
const path = require('path');
const ajv = require('ajv');

/* load the JSON schema */

let validator_factory = new ajv();

let validator = validator_factory.compile(
  JSON.parse(
    fs.readFileSync(
      "build/otio.schema.json",
      'utf8'
    )
  )
);

/* validate baseline documents */

let test_path = "src/test/json";

let files = fs.readdirSync(test_path);

for(const file of files) {

  console.log(path.join(test_path, file));

  let valid = validator(
    JSON.parse(
      fs.readFileSync(
        path.join(test_path, file),
        'utf8'
      )
    )
  );

  if (!valid) {
    console.log(validator.errors);
    continue;
  }

}

