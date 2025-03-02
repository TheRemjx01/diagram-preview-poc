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

module.exports = {
    RuleStrategy
};
