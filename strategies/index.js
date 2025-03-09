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

    getStyles() {
        return '';
    }
}

class StyledContentStrategy extends RuleStrategy {
    constructor(name) {
        super(name, null, null);
        this.currentIndent = 0;
    }

    getIndentLevel(line) {
        const match = line.match(/^(\s*)/);
        return match ? match[1].length : 0;
    }

    isEndOfBlock(line, previousIndent) {
        if (!line.trim()) return false;
        const currentIndent = this.getIndentLevel(line);
        return currentIndent < previousIndent;
    }

    parseStyleAttribute(line) {
        const styleMatch = line.match(/style="([^"]+)"/);
        return styleMatch ? styleMatch[1] : '';
    }

    parseContent(line) {
        const contentMatch = line.match(/"([^"]+)"/);
        return contentMatch ? contentMatch[1] : '';
    }

    applyStyle(element, style) {
        return style ? `${element} style="${style}"` : element;
    }
}

module.exports = {
    RuleStrategy,
    StyledContentStrategy
};
