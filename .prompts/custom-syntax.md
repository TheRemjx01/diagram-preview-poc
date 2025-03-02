# Custom Syntax Implementation for Markdown Preview

## Syntax Definition

The extension implements custom syntax for markdown preview with the following format:

```markdown
# CD_BEGIN
group "hello world"
# CD_END
```

## Implementation Details

1. Block Markers:
   - Begin: `# CD_BEGIN`
   - End: `# CD_END`
   - Renders as a div with class `custom-diagram-block`

2. Group Element:
   - Syntax: `group "text"`
   - Renders as nested divs with classes `cd-group` and `cd-group-content`

## Strategy Pattern Implementation

The extension uses a Strategy pattern for rule implementation:

```javascript
class RuleStrategy {
    constructor(name, startPattern, endPattern) {
        this.name = name;
        this.startPattern = startPattern;
        this.endPattern = endPattern;
    }

    matches(line) { return false; }
    parse(line) { return null; }
    render(content) { return ''; }
}
```

Example implementation (GroupRuleStrategy):
```javascript
class GroupRuleStrategy extends RuleStrategy {
    matches(line) {
        return line.match(/^group\s+"([^"]+)"$/);
    }

    parse(line) {
        const match = line.match(/^group\s+"([^"]+)"$/);
        return match ? match[1] : null;
    }

    render(content) {
        return `<div class="cd-group"><div class="cd-group-content">${content}</div></div>`;
    }
}
```

## Styling

The preview styling is defined in `media/preview.js`:

```css
.custom-diagram-block {
    margin: 1em 0;
    padding: 1em;
    background-color: #f8f8f8;
    border-radius: 4px;
}

.cd-group {
    margin: 0.5em 0;
    padding: 0.5em;
}

.cd-group-content {
    border: 1px solid #ccc;
    padding: 1em;
    border-radius: 4px;
    background-color: white;
}
```

## Extension Points

To add new syntax:
1. Create a new strategy extending `RuleStrategy`
2. Implement `matches`, `parse`, and `render` methods
3. Register the strategy with `CustomBlockManager`

## Build and Package

The extension is built and packaged using:
```bash
npm run package
```

This creates a VSIX file in the `public` directory.

## Testing

Tests are implemented using Mocha and the VS Code extension testing framework:
```bash
npm test
```

## Development Workflow

1. Make changes to syntax implementation
2. Update tests
3. Run tests and lint: `npm test`
4. Package: `npm run package`
5. Test in VS Code
6. Commit and push changes

## GitHub Actions

The GitHub workflow:
1. Builds on push to main and tags
2. Runs tests and lint
3. Creates VSIX package
4. Uploads as artifact

## Configuration Files

Key configuration files:
- `package.json`: Extension metadata and scripts
- `extension.js`: Main implementation
- `media/preview.js`: Preview styling
- `.eslintrc.json`: Linting rules
- `.github/workflows/publish.yml`: CI/CD configuration 