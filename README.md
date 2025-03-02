# Markdown Preview Enhancer

A Visual Studio Code extension that enhances the built-in Markdown preview with custom diagram syntax support.

## Features

- Custom diagram blocks with styled containers
- Group syntax for organizing content
- Seamless integration with VS Code's built-in Markdown preview

## Usage

### Custom Diagram Blocks

Create custom diagram blocks using the following syntax:

```markdown
# CD_BEGIN
group "Your Group Name"
# CD_END
```

You can have multiple groups within a block:

```markdown
# CD_BEGIN
group "Frontend"
group "Backend"
group "Database"
# CD_END
```

### Preview Your Markdown

1. Open your markdown file
2. Press `Cmd+Shift+V` (Mac) or `Ctrl+Shift+V` (Windows/Linux) to open the preview
3. Your custom blocks will be rendered with special styling

### Refresh Preview

If needed, you can manually refresh the preview:
1. Open the Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`)
2. Run "Refresh Markdown Preview Enhancement"

## Example

```markdown
# System Architecture

Here's our system layout:

# CD_BEGIN
group "User Interface"
group "API Gateway"
group "Database"
# CD_END

Regular markdown content continues here...
```

## Installation

1. Download the `.vsix` file from the releases
2. In VS Code, open the Command Palette
3. Run "Install from VSIX..." and select the downloaded file

## Development

1. Clone the repository
2. Run `npm install`
3. Press F5 to start debugging

## License

MIT 