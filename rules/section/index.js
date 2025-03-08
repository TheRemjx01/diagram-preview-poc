const { RuleStrategy } = require('../../strategies');
const fs = require('fs');
const path = require('path');

class SectionRuleStrategy extends RuleStrategy {
    constructor() {
        super('section', null, null);
        this.styles = null;
    }

    matches(line) {
        return line.match(/^section\s+"([^"]+)"$/);
    }

    parse(line) {
        const match = line.match(/^section\s+"([^"]+)"$/);
        return match ? match[1] : null;
    }

    render(content) {
        return `<div class="diagram-section"><div class="diagram-section-content">${content}</div></div>\n`;
    }

    getStyles() {
        if (!this.styles) {
            const cssPath = path.join(__dirname, 'styles.css');
            try {
                this.styles = fs.readFileSync(cssPath, 'utf8');
            } catch (error) {
                console.error('Error loading styles:', error);
                // Fallback to default styles if file loading fails
                this.styles = `
                    .diagram-section {
                        border: 2px solid #4a9eff;
                        padding: 8px;
                        margin: 5px 0;
                        border-radius: 4px;
                    }
                    
                    .diagram-section-content {
                        font-weight: bold;
                        color: #2c5ea5;
                    }
                `;
            }
        }
        return this.styles;
    }
}

module.exports = SectionRuleStrategy;
