const { StyledContentStrategy } = require('../../strategies');
const fs = require('fs');
const path = require('path');

class SectionContentStrategy extends StyledContentStrategy {
    constructor() {
        super('section-content');
    }

    matches(line) {
        const trimmed = line.trim();
        return trimmed.match(/^section-content\s+"[^"]+"/);
    }

    parse(line) {
        const content = this.parseContent(line.trim());
        const style = this.parseStyleAttribute(line);
        const indent = this.getIndentLevel(line);
        return { content, style, indent };
    }

    render(parsed) {
        const { content, style, indent } = parsed;
        const indentStr = ' '.repeat(indent);
        const div = '<div class="section-content"';
        return `${indentStr}${this.applyStyle(div, style)}>${content}</div>`;
    }

    getStyles() {
        return `
            .section-content {
                margin: 4px 0;
                padding: 4px;
            }
        `;
    }
}

class SectionStrategy extends StyledContentStrategy {
    constructor() {
        super('section');
        this.contentStrategy = new SectionContentStrategy();
        this.sectionStack = [];
    }

    matches(line) {
        const trimmed = line.trim();
        return trimmed.match(/^section\s+"[^"]+"/);
    }

    parse(line) {
        const content = this.parseContent(line.trim());
        const style = this.parseStyleAttribute(line);
        const indent = this.getIndentLevel(line);
        return { content, style, indent };
    }

    render(parsed) {
        const { content, style, indent } = parsed;
        const indentStr = ' '.repeat(indent);
        const div = `<div class="diagram-section level-${this.sectionStack.length}"`;
        return `${indentStr}${this.applyStyle(div, style)}>\n${indentStr}  <div class="diagram-section-title">${content}</div>`;
    }

    getStyles() {
        if (!this.styles) {
            const cssPath = path.join(__dirname, 'styles.css');
            try {
                this.styles = fs.readFileSync(cssPath, 'utf8');
            } catch (error) {
                console.error('Error loading styles:', error);
                this.styles = `
                    .diagram-section {
                        border: 2px solid #4a9eff;
                        padding: 8px;
                        margin: 5px 0;
                        border-radius: 4px;
                    }
                    
                    .diagram-section-title {
                        font-weight: bold;
                        color: #2c5ea5;
                        margin-bottom: 8px;
                    }

                    .diagram-section.level-1 {
                        margin-left: 20px;
                    }

                    .diagram-section.level-2 {
                        margin-left: 40px;
                    }
                `;
            }
        }
        return this.styles + this.contentStrategy.getStyles();
    }

    startSection(indent) {
        this.sectionStack.push(indent);
    }

    shouldEndSection(currentIndent) {
        if (this.sectionStack.length === 0) return false;
        return currentIndent <= this.sectionStack[this.sectionStack.length - 1];
    }

    endSection(currentIndent) {
        const closings = [];
        while (this.sectionStack.length > 0 && this.shouldEndSection(currentIndent)) {
            const lastIndent = this.sectionStack.pop();
            closings.push(' '.repeat(lastIndent) + '</div>');
        }
        return closings.join('\n');
    }

    processContent(line) {
        if (!line.trim()) return '';
        if (this.contentStrategy.matches(line)) {
            const parsed = this.contentStrategy.parse(line);
            return this.contentStrategy.render(parsed);
        }

        const currentIndent = this.getIndentLevel(line);
        if (this.shouldEndSection(currentIndent)) {
            return this.endSection(currentIndent);
        }

        if (this.matches(line)) {
            const parsed = this.parse(line);
            const closings = this.shouldEndSection(parsed.indent) ? this.endSection(parsed.indent) + '\n' : '';
            this.startSection(parsed.indent);
            return closings + this.render(parsed);
        }

        return null;
    }
}

module.exports = SectionStrategy;
