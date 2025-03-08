# Custom Diagram Example

This is regular markdown text with **bold** and *italic* formatting.

## Simple section Example

# DIAGRAM_BEGIN
section "Hello World"
# DIAGRAM_END

## Multiple Sections Example

# DIAGRAM_BEGIN
section "User Interface"
section "Database"
section "API Server"
# DIAGRAM_END

## Mixed Content Example

Here's a diagram showing a system architecture:

# DIAGRAM_BEGIN
section "Frontend Components"
section "Backend Services"
section "Data Storage"
# DIAGRAM_END

You can continue with regular markdown content below the diagrams.

## Notes
- The blocks start with `# DIAGRAM_BEGIN`
- Each section is defined with `section "name"`
- The blocks end with `# DIAGRAM_END`
- Regular markdown formatting works outside the blocks