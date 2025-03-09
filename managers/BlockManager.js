class BlockManager {
    constructor() {
        this.rules = new Map();
        this.currentBlock = null;
        this.currentEndPattern = null;
    }

    addRule(rule) {
        this.rules.set(rule.name, rule);
    }

    processLine(line) {
        // Check for block start/end patterns
        if (line.trim() === '# DIAGRAM_BEGIN') {
            this.currentBlock = [];
            this.currentEndPattern = '# DIAGRAM_END';
            return null;
        }

        if (line.trim() === this.currentEndPattern) {
            const blockContent = this.currentBlock.join('\n');
            this.currentBlock = null;
            this.currentEndPattern = null;
            return blockContent;
        }

        // If we're not in a block, return null
        if (!this.currentBlock) {
            return null;
        }

        // Process the line within the current block
        this.currentBlock.push(line);
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

    getAllStyles() {
        let styles = `
            .custom-diagram-block {
                border: 1px solid #ccc;
                padding: 10px;
                margin: 10px 0;
                background-color: #f9f9f9;
            }
        `;

        // Collect styles from all rules
        for (const rule of this.rules.values()) {
            styles += rule.getStyles();
        }

        return styles;
    }
}

module.exports = BlockManager;
