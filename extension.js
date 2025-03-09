const vscode = require('vscode');
const MarkdownIt = require('markdown-it');
const SectionStrategy = require('./rules/section');
const BlockManager = require('./managers/BlockManager');

function activate(context) {
    console.log('Extension is now active!');

    const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true
    });

    const blockManager = new BlockManager();
    const sectionStrategy = new SectionStrategy();
    blockManager.addRule(sectionStrategy);

    const customSyntaxPlugin = (md) => {
        const defaultRender = md.renderer.rules.fence || function(tokens, idx, options, env, slf) {
            return slf.renderToken(tokens, idx, options);
        };

        md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
            const token = tokens[idx];
            const content = token.content.trim();
            const lines = content.split('\n');
            let result = '';
            let currentBlock = [];

            for (const line of lines) {
                const blockContent = blockManager.processLine(line);
                if (blockContent !== null) {
                    // Process the complete block
                    const blockLines = blockContent.split('\n');
                    let blockResult = '';
                    for (const blockLine of blockLines) {
                        const lineResult = sectionStrategy.processContent(blockLine);
                        if (lineResult !== null) {
                            blockResult += lineResult + '\n';
                        }
                    }
                    result += blockResult;
                }
            }

            // Close any remaining sections
            result += sectionStrategy.endSection(0);

            return `<div class="diagram-container">${result}</div>`;
        };
    };

    md.use(customSyntaxPlugin);

    let disposable = vscode.commands.registerCommand('markdown-preview-enhancer.refreshPreview', () => {
        vscode.commands.executeCommand('markdown.preview.refresh');
    });

    context.subscriptions.push(disposable);

    return {
        extendMarkdownIt(md) {
            return md.use(customSyntaxPlugin);
        }
    };
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
