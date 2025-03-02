const vscode = require('vscode');
const MarkdownIt = require('markdown-it');

// Strategy interface for rule handlers
class RuleStrategy {
    constructor(name, startPattern, endPattern) {
        this.name = name;
        this.startPattern = startPattern;
        this.endPattern = endPattern;
    }

    matches(line) {
        return false;
    }

    parse(line) {
        return null;
    }

    render(content) {
        return '';
    }
}

// Group rule implementation
class GroupRuleStrategy extends RuleStrategy {
    constructor() {
        super('group', null, null);
    }

    matches(line) {
        return line.match(/^group\s+"([^"]+)"$/);
    }

    parse(line) {
        const match = line.match(/^group\s+"([^"]+)"$/);
        return match ? match[1] : null;
    }

    render(content) {
        return `<div class="cd-group"><div class="cd-group-content">${content}</div></div>\n`;
    }
}

// Block manager to handle custom block state and rules
class CustomBlockManager {
    constructor() {
        this.rules = new Map();
        this.inBlock = false;
    }

    addRule(rule) {
        this.rules.set(rule.name, rule);
    }

    processLine(line) {
        for (const rule of this.rules.values()) {
            if (rule.matches(line)) {
                const content = rule.parse(line);
                return content ? rule.render(content) : '';
            }
        }
        return null;
    }

    handleBlockStart(state, startLine) {
        const token = state.push('html_block', '', 0);
        token.content = '<div class="custom-diagram-block">\n';
        token.map = [startLine, startLine + 1];
        this.inBlock = true;
        return token;
    }

    handleBlockEnd(state, startLine) {
        const token = state.push('html_block', '', 0);
        token.content = '</div>\n';
        token.map = [startLine, startLine + 1];
        this.inBlock = false;
        return token;
    }

    handleContent(state, startLine, line) {
        const result = this.processLine(line);
        if (result !== null) {
            const token = state.push('html_inline', '', 0);
            token.content = result;
            return token;
        }
        return null;
    }
}

function activate(context) {
    // Register command
    const disposable = vscode.commands.registerCommand('markdown-preview-enhancer.refreshPreview', () => {
        vscode.commands.executeCommand('markdown.preview.refresh');
    });

    context.subscriptions.push(disposable);

    // Register the custom markdown-it plugin
    return {
        extendMarkdownIt(md) {
            const blockManager = new CustomBlockManager();
            blockManager.addRule(new GroupRuleStrategy());

            // Add custom block rule
            md.block.ruler.before('fence', 'custom_block', (state, startLine, endLine, silent) => {
                const pos = state.bMarks[startLine] + state.tShift[startLine];
                const max = state.eMarks[startLine];
                const line = state.src.slice(pos, max).trim();

                // Check for CD_BEGIN/CD_END
                if (line === '# CD_BEGIN') {
                    if (!silent) {
                        blockManager.handleBlockStart(state, startLine);
                        state.env.inCustomBlock = true;
                    }
                    state.line = startLine + 1;
                    return true;
                }

                if (line === '# CD_END') {
                    if (!silent) {
                        blockManager.handleBlockEnd(state, startLine);
                        state.env.inCustomBlock = false;
                    }
                    state.line = startLine + 1;
                    return true;
                }

                // Handle group content
                if (state.env.inCustomBlock) {
                    if (!silent && blockManager.handleContent(state, startLine, line)) {
                        state.line = startLine + 1;
                        return true;
                    }
                }

                return false;
            });

            // Initialize custom block environment
            md.core.ruler.before('block', 'custom_block_init', state => {
                state.env.inCustomBlock = false;
            });

            return md;
        }
    };
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
    // Export classes for external use
    RuleStrategy,
    GroupRuleStrategy,
    CustomBlockManager
};
