const assert = require('assert');
const { RuleStrategy, CustomBlockManager, SectionRuleStrategy } = require('../../extension');
const MarkdownIt = require('markdown-it');

suite('Extension Test Suite', () => {
    test('RuleStrategy base class', () => {
        const rule = new RuleStrategy('test', null, null);
        assert.strictEqual(rule.matches('any line'), false);
        assert.strictEqual(rule.parse('any line'), null);
        assert.strictEqual(rule.render('content'), '');
    });

    test('SectionRuleStrategy', () => {
        const rule = new SectionRuleStrategy();

        // Test matches
        assert.strictEqual(rule.matches('section "test content"'), true);
        assert.strictEqual(rule.matches('not a section'), false);
        assert.strictEqual(rule.matches('section without quotes'), false);

        // Test parse
        assert.strictEqual(rule.parse('section "hello world"'), 'hello world');
        assert.strictEqual(rule.parse('not a section'), null);

        // Test render
        const rendered = rule.render('test content');
        assert.strictEqual(
            rendered,
            '<div class="diagram-section"><div class="diagram-section-content">test content</div></div>'
        );
    });

    test('CustomBlockManager', () => {
        const manager = new CustomBlockManager();
        const rule = new SectionRuleStrategy();

        // Test rule registration
        manager.addRule(rule);
        assert.strictEqual(manager.rules.has('section'), true);
        assert.strictEqual(manager.rules.size, 1);

        // Test line processing
        assert.strictEqual(manager.inBlock, false);
        const result = manager.processLine('section "test content"');
        assert.strictEqual(
            result,
            '<div class="diagram-section"><div class="diagram-section-content">test content</div></div>'
        );

        // Test invalid line processing
        const invalidResult = manager.processLine('not a valid line');
        assert.strictEqual(invalidResult, null);
    });

    test('Custom Block Integration', () => {
        const md = new MarkdownIt();
        const { extendMarkdownIt } = require('../../extension').activate();
        const extended = extendMarkdownIt(md);

        // Test markdown rendering
        const input = [
            '# DIAGRAM_BEGIN',
            'section "hello world"',
            '# DIAGRAM_END'
        ].join('\n');

        const result = extended.render(input);

        // Verify the output contains our custom elements
        assert.ok(result.includes('diagram-block'));
        assert.ok(result.includes('diagram-section'));
        assert.ok(result.includes('hello world'));
    });
});

// Custom Rule Strategy Test Example
suite('Custom Rule Strategy Example', () => {
    class CustomTestRule extends RuleStrategy {
        constructor() {
            super('test-rule', null, null);
        }

        matches(line) {
            return line.startsWith('test:');
        }

        parse(line) {
            return line.startsWith('test:') ? line.slice(5).trim() : null;
        }

        render(content) {
            return `<div class="test-rule">${content}</div>`;
        }
    }

    test('Custom Rule Implementation', () => {
        const rule = new CustomTestRule();

        // Test matches
        assert.strictEqual(rule.matches('test: content'), true);
        assert.strictEqual(rule.matches('not a test'), false);

        // Test parse
        assert.strictEqual(rule.parse('test: content'), 'content');
        assert.strictEqual(rule.parse('not a test'), null);

        // Test render
        assert.strictEqual(
            rule.render('content'),
            '<div class="diagram-block">content</div>'
        );
    });

    test('Custom Rule Integration with BlockManager', () => {
        const manager = new CustomBlockManager();
        const rule = new CustomTestRule();

        manager.addRule(rule);

        const result = manager.processLine('test: custom content');
        assert.strictEqual(
            result,
            '<div class="diagram-block">custom content</div>'
        );
    });
});
