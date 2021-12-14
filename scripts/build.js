const fs = require('fs');
const path = require('path');
const mume = require("@shd101wyy/mume");
const hb = require('handlebars');
const proc = require('child_process');
const ajv = require('ajv');

const SPEC_PATH = "src/main/md/otio-core.md";
const SCHEMA_TEMPLATE_PATH = "src/main/templates/otio.schema.hbs";
const BUILD_PATH_DIR = "build";
const SCHEMA_JSON_OUTPUT = "otio.schema.json";
const SPEC_OUTPUT = path.join(BUILD_PATH_DIR, "index.md");

/* create build directory */

fs.mkdirSync(BUILD_PATH_DIR, { recursive: true });

/* instantiate schema template */

let schema_template = hb.compile(
  fs.readFileSync(
    SCHEMA_TEMPLATE_PATH,
    'utf8'
  ),
  { noEscape: true }
);

if (!schema_template) {
  throw "Cannot load JSON schema template";
}

/* load spec */

let spec_in = fs.readFileSync(SPEC_PATH).toString();

if (!spec_in) {
  throw "Cannot load specification";
}

/* get the version field */

const version = proc.execSync('git rev-parse HEAD').toString().trim();

/* extract json schema from spec */

const json_re = /^```json$([^`]*)^```$/gm;

let found_block;

let blocks = [];

while ((found_block = json_re.exec(spec_in)) !== null) {
  blocks.push(found_block[1]);
}

/* generate the final MD spec */

spec_in = spec_in + `
## JSON Schema File

[Collected JSON Schema definitions](otio.schema.json)

## Version

${version} 
`;

fs.writeFileSync(
  SPEC_OUTPUT,
  spec_in,
  'utf8'
);

/* generate json schema */

let temp = schema_template(blocks);

fs.writeFileSync(path.join(BUILD_PATH_DIR, "temp.json"), temp, 'utf8');

let json_schema = JSON.parse(temp);

/* validate the JSON schema */

let validator_factory = new ajv();

let validator = validator_factory.compile(json_schema);

/* write the JSON schema */

fs.writeFileSync(path.join(BUILD_PATH_DIR, SCHEMA_JSON_OUTPUT), JSON.stringify(json_schema, null, "  "), 'utf8');

/* copy figures */

fs.mkdirSync(path.join(BUILD_PATH_DIR, "figures"), { recursive: true });
fs.copyFileSync("figures/stack-model.png", "build/figures/stack-model.png");
fs.copyFileSync("figures/track-model.png", "build/figures/track-model.png");

/* generate HTML */

(async function () {

  try {

    await mume.init(BUILD_PATH_DIR);

    const engine = new mume.MarkdownEngine({
      filePath: SPEC_OUTPUT,
      config: {
        configPath : BUILD_PATH_DIR,
        enableScriptExecution: true
      }
    });

    await engine.htmlExport({
      offline: false,
      runAllCodeChunks: true
    });

  } catch(e) {

    console.error(e);

  }

  process.exit();

})()