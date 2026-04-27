# README Section Guard

A lightweight GitHub Action that ensures required sections exist in your README file.

Useful for enforcing consistency across repositories by checking for sections like Usage, Contributing, and License.

## 🚀 Quick Start

Create a workflow file such as `.github/workflows/readme-check.yml`:

```yaml
name: README Check

on:
  pull_request:
  push:
    branches: [main]

jobs:
  readme-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate README sections
        uses: brandonhimpfen/readme-section-guard@v1
        with:
          required-sections: 'Usage,Contributing,License'
```

## ⚙️ Inputs

| Input | Description | Required | Default |
|---|---|---:|---|
| `readme-path` | Path to the README file | No | `README.md` |
| `required-sections` | Comma-separated list of required sections | No | `Usage,Contributing,License` |
| `case-sensitive` | Match headings with case sensitivity | No | `false` |
| `fail-on-missing-readme` | Fail if README does not exist | No | `true` |

## 🧪 Examples

### Require standard open source sections

```yaml
- uses: brandonhimpfen/readme-section-guard@v1
  with:
    required-sections: 'Installation,Usage,Contributing,License'
```

### Check a README in a custom location

```yaml
- uses: brandonhimpfen/readme-section-guard@v1
  with:
    readme-path: 'docs/README.md'
    required-sections: 'Overview,Usage,Support'
```

## 🔍 How It Works

The action scans the README file and looks for Markdown headings that match the required section names.

For example, the section `Usage` will match:

```markdown
## Usage
```

Supports heading levels `#` through `######`.

## ❌ Failure Behavior

The action will fail the workflow if:
- A required section is missing
- The README file is missing (if enabled)

## 💡 Why Use This?

- Enforce documentation standards across repos
- Improve contributor experience
- Ensure required sections are never skipped
- Keep projects consistent at scale

## 📄 License

MIT License
