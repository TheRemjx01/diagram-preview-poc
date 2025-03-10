# Markdown Preview Enhancer

A Visual Studio Code extension that enhances the built-in Markdown preview with custom diagram syntax support.

[![Built with Cursor](https://img.shields.io/badge/Built_with-Cursor-5B86E5.svg)](https://cursor.sh)
[![Powered by Claude 3.5 Sonnet](https://img.shields.io/badge/Powered_by-Claude_3.5_Sonnet-8A2BE2.svg)](https://www.anthropic.com/claude)

## Features

- Custom diagram blocks with styled containers
- Section-based content organization
- Seamless integration with VS Code's built-in Markdown preview
- Modular rule system for easy extension
- Dynamic styling per rule

## Architecture

### System Overview
```mermaid
graph TB
    subgraph VSCode["VS Code"]
        MP[Markdown Preview]
        MI[markdown-it]
    end

    subgraph Extension["Our Extension"]
        BM[Block Manager]
        RS[Rule Strategy]
        R1[Rules]
    end

    MP --> MI
    MI --> BM
    BM --> RS
    RS --> R1

    style VSCode fill:#e1f5fe,stroke:#01579b
    style Extension fill:#f3e5f5,stroke:#4a148c
```

### How It Works
```mermaid
sequenceDiagram
    participant MD as Markdown
    participant MI as markdown-it
    participant BM as Block Manager
    participant RS as Rules

    MD->>MI: Parse markdown
    MI->>BM: Process blocks
    BM->>RS: Apply rules
    RS->>BM: Return HTML & styles
    BM->>MI: Return tokens
```

## Usage

### Custom Diagram Blocks

Create custom diagram blocks using the following syntax:

```markdown
# DIAGRAM_BEGIN
section "Your Section Name"
# DIAGRAM_END
```

You can have multiple sections within a block:

```markdown
# DIAGRAM_BEGIN
section "Frontend"
section "Backend"
section "Database"
# DIAGRAM_END
```

### Preview Your Markdown

1. Open your markdown file
2. Press `Cmd+Shift+V` (Mac) or `Ctrl+Shift+V` (Windows/Linux) to open the preview
3. Your custom blocks will be rendered with special styling

### Refresh Preview

If needed, you can manually refresh the preview:
1. Open the Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`)
2. Run "Refresh Markdown Preview Enhancement"

## Project Structure

```
project/
├── rules/              # Individual rule implementations
│   └── section/       # Section rule implementation
│       ├── index.js   # Rule implementation
│       └── styles.css # Section-specific styles
├── strategies/        # Base strategy classes
│   └── index.js      # RuleStrategy base class
├── managers/         # Rule management
│   └── BlockManager.js # Handles rules and block processing
└── media/           # Preview-related files
    └── preview.js   # Preview script with dynamic styles
```

## Extending the Extension

### Creating a New Rule

1. Create a new directory under `rules/` for your rule:
```bash
mkdir -p rules/your-rule
```

2. Create an implementation file (`rules/your-rule/index.js`):
```javascript
const { RuleStrategy } = require('../../strategies');

class YourRuleStrategy extends RuleStrategy {
    constructor() {
        super('your-rule', null, null);
    }

    matches(line) {
        return line.match(/your pattern/);
    }

    parse(line) {
        const match = line.match(/your pattern/);
        return match ? match[1] : null;
    }

    render(content) {
        return `<div class="your-class">${content}</div>`;
    }

    getStyles() {
        return `
            .your-class {
                /* Your CSS rules */
            }
        `;
    }
}

module.exports = YourRuleStrategy;
```

3. Register your rule in `extension.js`:
```javascript
const YourRuleStrategy = require('./rules/your-rule');
// ...
blockManager.addRule(new YourRuleStrategy());
```

### Rule Strategy Interface

The `RuleStrategy` base class provides:
- `matches(line)`: Determines if the line matches this rule
- `parse(line)`: Extracts content from the line
- `render(content)`: Renders HTML for the content
- `getStyles()`: Returns CSS styles for this rule

### Block Manager

The `CustomBlockManager` handles:
- Rule registration and management
- Block state tracking
- Token generation for markdown-it
- Style collection from all rules

## Example

```markdown
# System Architecture

Here's our system layout:

# DIAGRAM_BEGIN
section "User Interface"
section "API Gateway"
section "Database"
# DIAGRAM_END

Regular markdown content continues here...
```

## Installation

1. Download the `.vsix` file from the releases
2. In VS Code, open the Command Palette
3. Run "Install from VSIX..." and select the downloaded file

## Development

For detailed development and debugging guidelines, please refer to [DEVELOPMENT.md](DEVELOPMENT.md).

## Credits

This project was developed with:
- [Cursor](https://cursor.sh) - The AI-first code editor
- [Claude 3.5 Sonnet](https://www.anthropic.com/claude) - Advanced AI assistant by Anthropic

## License

MIT 