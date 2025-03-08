const vscode = require('vscode');
const CustomBlockManager = require('./managers/BlockManager');
const SectionRuleStrategy = require('./rules/section');

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

            // Register rules
            blockManager.addRule(new SectionRuleStrategy());

            // Add custom block rule
            md.block.ruler.before('fence', 'custom_block', (state, startLine, endLine, silent) => {
                const pos = state.bMarks[startLine] + state.tShift[startLine];
                const max = state.eMarks[startLine];
                const line = state.src.slice(pos, max).trim();

                // Check for DIAGRAM_BEGIN/DIAGRAM_END
                if (line === '# DIAGRAM_BEGIN') {
                    if (!silent) {
                        blockManager.handleBlockStart(state, startLine);
                        state.env.inCustomBlock = true;
                    }
                    state.line = startLine + 1;
                    return true;
                }

                if (line === '# DIAGRAM_END') {
                    if (!silent) {
                        blockManager.handleBlockEnd(state, startLine);
                        state.env.inCustomBlock = false;
                    }
                    state.line = startLine + 1;
                    return true;
                }

                // Handle section content
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
    deactivate
};
