# Custom Diagram Example

This is regular markdown text with **bold** and *italic* formatting.

## Simple Group Example

# CD_BEGIN
group "Hello World"
# CD_END

## Multiple Groups Example

# CD_BEGIN
group "User Interface"
group "Database"
group "API Server"
# CD_END

## Mixed Content Example

Here's a diagram showing a system architecture:

# CD_BEGIN
group "Frontend Components"
group "Backend Services"
group "Data Storage"
# CD_END

You can continue with regular markdown content below the diagrams.

## Notes
- The blocks start with `# CD_BEGIN`
- Each group is defined with `group "name"`
- The blocks end with `# CD_END`
- Regular markdown formatting works outside the blocks