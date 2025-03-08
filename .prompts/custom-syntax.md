# Custom Syntax Implementation for Markdown Preview

## Syntax Definition

The extension implements custom syntax for markdown preview with the following format:

```markdown
# DIAGRAM_BEGIN
section "hello world"
# DIAGRAM_END
```

## Implementation Details

1. Block Markers:
   - Begin: `# DIAGRAM_BEGIN`
   - End: `# DIAGRAM_END`
   - Renders as a div with class `diagram-block`

2. Section Element:
   - Syntax: `section "text"`
   - Renders as nested divs with classes `diagram-section` and `diagram-section-content`

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

Example implementation (SectionRuleStrategy):
```javascript
class SectionRuleStrategy extends RuleStrategy {
    matches(line) {
        return line.match(/^section\s+"([^"]+)"$/);
    }

    parse(line) {
        const match = line.match(/^section\s+"([^"]+)"$/);
        return match ? match[1] : null;
    }

    render(content) {
        return `<div class="diagram-section"><div class="diagram-section-content">${content}</div></div>`;
    }
}
```

## Styling

The preview styling is defined in `rules/section/styles.css`:

```css
.diagram-section {
    border: 2px solid #4a9eff;
    padding: 8px;
    margin: 5px 0;
    border-radius: 4px;
}

.diagram-section-content {
    font-weight: bold;
    color: #2c5ea5;
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
- `rules/section/styles.css`: Section styling
- `.eslintrc.json`: Linting rules
- `.github/workflows/publish.yml`: CI/CD configuration 