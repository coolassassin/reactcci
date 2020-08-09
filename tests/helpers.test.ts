import {
    capitalizeName,
    isDirectory,
    makePathShort,
    processCommandLineArguments,
    processComponentNameString,
    processPath
} from '../src/helpers';

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

    it.each([
        [
            ['test', 'test', 'test'],
            ['test', 'test', 'test']
        ],
        [
            ['test', '--test', 'test'],
            ['test', '--test', 'test']
        ],
        [
            ['test', '--name', 'test'],
            ['test', '--name', 'test']
        ],
        [
            ['test', '-n', 'test'],
            ['test', '-n', 'test']
        ],
        [
            ['test', '--name', 'test', 'test'],
            ['test', '--name', 'test test']
        ],
        [
            ['test', '-n', 'test', 'test'],
            ['test', '-n', 'test test']
        ],
        [
            ['test', '-n', 'test', 'test', '--test'],
            ['test', '-n', 'test test', '--test']
        ]
    ])('processCommandLineArguments: %s processed to %s', (value, expected) => {
        expect(processCommandLineArguments(value)).toEqual(expected);
    });

    it.each([
        [undefined, undefined],
        ['a', ['a']],
        [' a ', ['a']],
        ['a  a', ['a']],
        ['a  b', ['a', 'b']],
        ['  a  b c  ', ['a', 'b', 'c']]
    ])('processComponentNameString: "%s" processed to %s', (value, expected) => {
        expect(processComponentNameString(value)).toEqual(expected);
    });
});
