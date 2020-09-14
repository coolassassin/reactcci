import mockFs from 'mock-fs';

import path from 'path';

import {
    capitalizeName,
    getIsFileAlreadyExists,
    getRelativePath,
    isDirectory,
    makePathShort,
    processCommandLineArguments,
    processComponentNameString,
    processPath,
    splitStringByCapitalLetter
} from '../src/helpers';

jest.mock('../src/componentSettingsMap', () => {
    return {
        componentSettingsMap: {
            root: process.cwd(),
            project: '',
            projectRootPath: 'src/',
            resultPath: '.'
        }
    };
});

describe('helpers', () => {
    const fsMockFolders = {
        node_modules: mockFs.load(path.resolve(__dirname, '../node_modules')),
        src: {
            TestComponent: {
                'index.ts': '',
                'TestComponent.tsx': ''
            }
        },
        emptyFolder: {}
    };

    beforeEach(() => {
        mockFs(fsMockFolders);
    });

    afterEach(() => {
        mockFs.restore();
    });

    it('capitalizeName', () => {
        expect(capitalizeName('test')).toBe('Test');
    });

    it('isDirectory', () => {
        expect(isDirectory('emptyFolder')).toBe(true);
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

    it.each([
        [undefined, undefined],
        ['', undefined],
        ['a', ['a']],
        [' a ', [' a ']],
        ['B  b', ['B  b']],
        ['TestValue', ['Test', 'Value']],
        ['OneMoreTESTValue', ['One', 'More', 'T', 'E', 'S', 'T', 'Value']]
    ])('processComponentNameString: "%s" processed to %s', (value, expected) => {
        expect(splitStringByCapitalLetter(value)).toEqual(expected);
    });

    it.each([
        ['index.ts', true],
        ['[name].tsx', true],
        ['[name].module.css', false]
    ])('getRelativePath: relative path from "%s" to "%s" is "%s"', (fileNameTemplate, expected) => {
        expect(getIsFileAlreadyExists(fileNameTemplate, 'TestComponent')).toEqual(expected);
    });
});
