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

module.exports = CustomBlockManager;
