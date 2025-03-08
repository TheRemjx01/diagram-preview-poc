# VS Code Markdown Preview Enhancement Extension

## Overview
This extension enhances VS Code's built-in Markdown preview by adding support for custom diagram blocks using a simple syntax and modular rule system.

## Architecture

### System Components
```mermaid
graph TB
    subgraph VSCode["VS Code"]
        MP[Markdown Preview]
        MI[markdown-it]
        WV[WebView Panel]
    end

    subgraph Extension["Our Extension"]
        EP[Extension Point]
        BM[Block Manager]
        RS[Rule Strategy]
        R1[Rule: Group]
        R2[Rule: Future Rules...]
        PS[Preview Script]
    end

    MP --> MI
    MI --> EP
    EP --> BM
    BM --> RS
    RS --> R1
    RS --> R2
    BM --> PS
    PS --> WV

    style VSCode fill:#e1f5fe,stroke:#01579b
    style Extension fill:#f3e5f5,stroke:#4a148c
```

### Rule Processing Flow
```mermaid
sequenceDiagram
    participant MD as Markdown File
    participant MI as markdown-it
    participant BM as Block Manager
    participant RS as Rule Strategy
    participant WV as WebView

    MD->>MI: Parse markdown
    MI->>BM: Process custom block
    BM->>RS: Match & parse line
    RS->>BM: Return HTML & styles
    BM->>MI: Return tokens
    MI->>WV: Render HTML
    WV->>WV: Apply styles
```

### Markdown-it Integration Details

VS Code's Markdown Preview uses markdown-it as its core markdown parser. Our extension hooks into this system through several key points:

1. **Extension Points**
```mermaid
graph LR
    subgraph markdown-it
        BR[Block Rules]
        CR[Core Rules]
        TR[Token Rendering]
    end

    subgraph Our Extension
        CB[Custom Block Rule]
        CI[Custom Init Rule]
        ST[Style Integration]
    end

    BR --> CB
    CR --> CI
    TR --> ST

    style markdown-it fill:#e8f5e9,stroke:#2e7d32
    style Our Extension fill:#fff3e0,stroke:#e65100
```

2. **Integration Methods**
   - **Block Rules**: We insert our custom block rule before the 'fence' rule
   ```javascript
   md.block.ruler.before('fence', 'custom_block', (state, startLine, endLine, silent) => {
       // Process custom blocks
   });
   ```
   
   - **Core Rules**: We initialize our environment before block processing
   ```javascript
   md.core.ruler.before('block', 'custom_block_init', state => {
       state.env.inCustomBlock = false;
   });
   ```

   - **Token Generation**: We create HTML tokens for rendering
   ```javascript
   const token = state.push('html_block', '', 0);
   token.content = '<div class="custom-diagram-block">\n';
   ```

### Component Responsibilities

1. **VS Code Components**
   - `Markdown Preview`: Handles markdown rendering in VS Code
   - `markdown-it`: Core markdown parsing engine
   - `WebView Panel`: Displays rendered content

2. **Extension Components**
   - `Block Manager`: 
     - Coordinates rule processing
     - Manages block state
     - Collects styles
   ```javascript
   class CustomBlockManager {
       processLine(line) { /* ... */ }
       handleBlockStart(state, startLine) { /* ... */ }
       handleBlockEnd(state, startLine) { /* ... */ }
       getAllStyles() { /* ... */ }
   }
   ```

   - `Rule Strategy`:
     - Defines rule interface
     - Handles pattern matching
     - Manages rule-specific styling
   ```javascript
   class RuleStrategy {
       matches(line) { /* ... */ }
       parse(line) { /* ... */ }
       render(content) { /* ... */ }
       getStyles() { /* ... */ }
   }
   ```

### Dynamic Style System
```mermaid
graph TD
    subgraph Rules
        R1[Rule 1 Styles]
        R2[Rule 2 Styles]
        R3[Rule n Styles]
    end

    subgraph BlockManager
        SC[Style Collector]
    end

    subgraph Preview
        PS[Preview Script]
        SS[Style Sheet]
    end

    R1 --> SC
    R2 --> SC
    R3 --> SC
    SC --> PS
    PS --> SS

    style Rules fill:#fff8e1,stroke:#ff6f00
    style BlockManager fill:#f3e5f5,stroke:#4a148c
    style Preview fill:#e8eaf6,stroke:#1a237e
```

## Custom Syntax

### Block Markers
- `# DIAGRAM_BEGIN`: Starts a custom diagram block
- `# DIAGRAM_END`: Ends a custom diagram block

### section Elements
Inside a custom block, use:
```markdown
section "Your Text Here"
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

### Markdown-it Integration
The extension uses markdown-it's block rule system to:
1. Detect custom block markers
2. Parse section elements
3. Generate HTML with appropriate classes

### CSS Classes
- `.custom-diagram-block`: Container for the entire block
- `.diagram-section`: Individual section container
- `.diagram-section-content`: section text content

## Adding New Rules

1. Create rule directory:
   ```bash
   mkdir -p rules/new-rule
   ```

2. Implement rule strategy:
   ```javascript
   class NewRuleStrategy extends RuleStrategy {
       matches(line) { /* ... */ }
       parse(line) { /* ... */ }
       render(content) { /* ... */ }
       getStyles() { /* ... */ }
   }
   ```

3. Register in extension:
   ```javascript
   blockManager.addRule(new NewRuleStrategy());
   ```

## Example Usage
```markdown
# DIAGRAM_BEGIN
section "Component A"
section "Component B"
# DIAGRAM_END
```

Renders as:
```html
<div class="diagram-block">
  <div class="diagram-section"><div class="diagram-section-content">Component A</div></div>
  <div class="diagram-section"><div class="diagram-section-content">Component B</div></div>
</div>
```

## Debugging Guide

### Debug Architecture
```mermaid
graph TB
    subgraph IDE["VS Code IDE"]
        EP[Extension Process]
        DH[Debug Host]
        DC[Debug Console]
    end

    subgraph Extension["Extension Development Host"]
        MP[Markdown Preview]
        DT[DevTools]
        BP[Breakpoints]
    end

    EP --> DH
    DH --> MP
    EP --> DC
    MP --> DT
    DH --> BP

    style IDE fill:#e1f5fe,stroke:#01579b
    style Extension fill:#f3e5f5,stroke:#4a148c
```

### Debug Flow
```mermaid
sequenceDiagram
    participant IDE as VS Code IDE
    participant EXT as Extension Host
    participant PRV as Preview
    participant DBG as Debugger

    IDE->>EXT: Launch Extension
    EXT->>DBG: Attach Debugger
    EXT->>PRV: Open Preview
    PRV->>DBG: Hit Breakpoint
    DBG->>IDE: Show Debug Info
    IDE->>EXT: Continue/Step
```

### Debugging Components

1. **Extension Process**
   ```mermaid
   graph LR
       A[Extension Entry] --> B{Activation}
       B -->|Success| C[Rule Processing]
       B -->|Failure| D[Debug Console]
       C --> E[Token Generation]
       E --> F[Preview Rendering]
   ```

2. **Debug Points**
   - **Extension Activation**:
     ```javascript
     function activate(context) {
         // Breakpoint 1: Extension startup
         debugger;
         // Watch for extension initialization
     }
     ```

   - **Rule Processing**:
     ```javascript
     class CustomBlockManager {
         processLine(line) {
             // Breakpoint 2: Line processing
             debugger;
             // Watch for line content and rule matching
         }
     }
     ```

   - **Token Generation**:
     ```javascript
     handleBlockStart(state, startLine) {
         // Breakpoint 3: Token creation
         debugger;
         // Watch token properties and HTML generation
     }
     ```

   - **Style Application**:
     ```javascript
     getAllStyles() {
         // Breakpoint 4: Style collection
         debugger;
         // Watch style aggregation from rules
     }
     ```

### Debug Configurations

1. **launch.json**:
   ```json
   {
       "version": "0.2.0",
       "configurations": [
           {
               "name": "Run Extension",
               "type": "extensionHost",
               "request": "launch",
               "args": [
                   "--extensionDevelopmentPath=${workspaceFolder}"
               ]
           },
           {
               "name": "Extension Tests",
               "type": "extensionHost",
               "request": "launch",
               "args": [
                   "--extensionDevelopmentPath=${workspaceFolder}",
                   "--extensionTestsPath=${workspaceFolder}/test/suite/index"
               ]
           }
       ]
   }
   ```

2. **Debug Console Filters**:
   ```javascript
   // Enable specific debug areas
   const DEBUG = {
       rules: true,
       tokens: true,
       styles: true
   };

   // Usage in code
   if (DEBUG.rules) {
       console.log('Rule matching:', line);
   }
   ```

### Common Debug Scenarios

1. **Rule Matching Issues**
   ```mermaid
   graph TD
       A[Rule Not Matching] --> B{Check Pattern}
       B -->|Invalid| C[Fix Regex]
       B -->|Valid| D[Check Input]
       D --> E[Verify Line Content]
       E --> F[Check Whitespace]
   ```

2. **Style Application Issues**
   ```mermaid
   graph TD
       A[Styles Not Applied] --> B{Check Steps}
       B -->|1| C[Rule getStyles]
       B -->|2| D[BlockManager Collection]
       B -->|3| E[Preview Script]
       B -->|4| F[DevTools Inspection]
   ```

3. **Token Generation Issues**
   ```mermaid
   graph TD
       A[Token Problems] --> B{Verify}
       B -->|Content| C[HTML Structure]
       B -->|State| D[Block Status]
       B -->|Position| E[Line Numbers]
   ```

### Debugging Best Practices

1. **Logging Strategy**
   - Use descriptive log messages
   - Include relevant data context
   - Categorize log types
   ```javascript
   console.log('[Rule]', { line, match, result });
   console.log('[Token]', { type, content, map });
   console.log('[Style]', { rule, css });
   ```

2. **Breakpoint Placement**
   - Strategic points in code flow
   - Data transformation points
   - State change locations

3. **State Inspection**
   - Watch variables for changes
   - Monitor block state transitions
   - Track token generation

4. **Preview Debugging**
   - Use DevTools Elements panel
   - Inspect generated HTML
   - Verify style application 