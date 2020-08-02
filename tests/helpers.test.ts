import { capitalizeName, isDirectory, makePathShort, processPath } from '../src/helpers';

jest.mock('fs', () => {
    return {
        lstatSync: () => ({
            isDirectory: () => true
        })
    };
});

describe('helpers', () => {
    it('capitalizeName', () => {
        expect(capitalizeName('test')).toBe('Test');
    });

    it('isDirectory', () => {
        expect(isDirectory('test')).toBe(true);
    });

    it.each([
        ['a', 'a'],
        ['a/b/', 'a/b'],
        ['/a/b', 'a/b'],
        ['\\a/b', 'a/b'],
        ['a/b/', 'a/b'],
        ['a/b/c\\', 'a/b/c']
    ])('processPath: %s converted to %s', (value, expected) => {
        expect(processPath(value)).toBe(expected);
    });

    it.each([
        ['a', 'a'],
        ['a/b', 'a/b'],
        ['a/b/c', 'a/b/c'],
        ['a/b/c/d', 'a/b/c/d'],
        ['a/b/c/d/e', 'a/.../c/d/e'],
        ['a/b/c/d/e/f', 'a/.../d/e/f'],
        ['a\\b\\c\\d\\e\\f', 'a/.../d/e/f']
    ])('makePathShort: %s shorted to %s', (value, expected) => {
        expect(makePathShort(value)).toBe(expected);
    });
});
