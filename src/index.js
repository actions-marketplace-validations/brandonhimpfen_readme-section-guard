const fs = require('fs');
const path = require('path');

function getInput(name, defaultValue = '') {
  const key = `INPUT_${name.replace(/ /g, '_').replace(/-/g, '_').toUpperCase()}`;
  return process.env[key] || defaultValue;
}

function setFailed(message) {
  console.error(`::error::${message}`);
  process.exitCode = 1;
}

function info(message) {
  console.log(message);
}

function normalize(value, caseSensitive) {
  const trimmed = value.trim();
  return caseSensitive ? trimmed : trimmed.toLowerCase();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sectionExists(readmeContent, section, caseSensitive) {
  const flags = caseSensitive ? 'm' : 'im';
  const escapedSection = escapeRegExp(section.trim());

  // Matches Markdown ATX headings such as:
  // ## Usage
  // ### Contributing
  // # License
  const headingPattern = new RegExp(`^\\s{0,3}#{1,6}\\s+${escapedSection}\\s*#*\\s*$`, flags);

  return headingPattern.test(readmeContent);
}

function run() {
  const readmePathInput = getInput('readme-path', 'README.md');
  const requiredSectionsInput = getInput('required-sections', 'Usage,Contributing,License');
  const caseSensitive = normalize(getInput('case-sensitive', 'false'), false) === 'true';
  const failOnMissingReadme = normalize(getInput('fail-on-missing-readme', 'true'), false) === 'true';

  const readmePath = path.resolve(process.cwd(), readmePathInput);
  const requiredSections = requiredSectionsInput
    .split(',')
    .map((section) => section.trim())
    .filter(Boolean);

  if (requiredSections.length === 0) {
    setFailed('No required sections were provided.');
    return;
  }

  if (!fs.existsSync(readmePath)) {
    const message = `README file not found at ${readmePathInput}.`;
    if (failOnMissingReadme) {
      setFailed(message);
    } else {
      info(`Warning: ${message}`);
    }
    return;
  }

  const readmeContent = fs.readFileSync(readmePath, 'utf8');
  const missingSections = requiredSections.filter(
    (section) => !sectionExists(readmeContent, section, caseSensitive)
  );

  if (missingSections.length > 0) {
    setFailed(`Missing required README section(s): ${missingSections.join(', ')}`);
    return;
  }

  info(`README section check passed. Required sections found: ${requiredSections.join(', ')}`);
}

run();
