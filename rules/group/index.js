const { RuleStrategy } = require('../../strategies');

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

    getStyles() {
        return `
            .cd-group {
                border: 2px solid #4a9eff;
                padding: 8px;
                margin: 5px 0;
                border-radius: 4px;
            }
            
            .cd-group-content {
                font-weight: bold;
                color: #2c5ea5;
            }
        `;
    }
}

module.exports = GroupRuleStrategy;
