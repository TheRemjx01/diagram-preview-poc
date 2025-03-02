# VS Code Markdown Preview Enhancement Extension

## Overview
This extension enhances VS Code's built-in Markdown preview by adding support for custom diagram blocks using a simple syntax.

## Custom Syntax

### Block Markers
- `# CD_BEGIN`: Starts a custom diagram block
- `# CD_END`: Ends a custom diagram block

### Group Elements
Inside a custom block, use:
```markdown
group "Your Text Here"
```

## Implementation Details

### Extension Structure
- `extension.js`: Main extension code
  - Registers markdown-it plugin
  - Handles custom block parsing
  - Manages block state
- `media/preview.js`: Preview script
  - Adds custom styles
  - Monitors for block elements
- `media/preview.css`: Styling for custom blocks

### Markdown-it Integration
The extension uses markdown-it's block rule system to:
1. Detect custom block markers
2. Parse group elements
3. Generate HTML with appropriate classes

### CSS Classes
- `.custom-diagram-block`: Container for the entire block
- `.cd-group`: Individual group container
- `.cd-group-content`: Group text content

## Example Usage
```markdown
# CD_BEGIN
group "Component A"
group "Component B"
# CD_END
```

Renders as:
```html
<div class="custom-diagram-block">
  <div class="cd-group"><div class="cd-group-content">Component A</div></div>
  <div class="cd-group"><div class="cd-group-content">Component B</div></div>
</div>
``` 