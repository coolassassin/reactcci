import mockFs from 'mock-fs';

import path from 'path';

import defaultConfig from '../defaultConfig';
import {
    capitalizeName,
    getFileIndexForTemplate,
    getFileTemplates,
    getIsFileAlreadyExists,
    getObjectNameParts,
    isDirectory,
    makePathShort,
    mapNameToCase,
    processCommandLineArguments,
    processComponentNameString,
    processPath,
    splitStringByCapitalLetter
} from '../src/helpers';
import { CommandLineFlags, TypingCases, Config } from '../src/types';

jest.mock('../src/componentSettingsMap', () => {
    return {
        componentSettingsMap: {
            project: '',
            projectRootPath: 'src/',
            resultPath: '.'
        }
    };
});

describe('helpers', () => {
    const root = process.cwd();
    let config = {} as Config;
    let commandLineFlags: CommandLineFlags | undefined = undefined;
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
        commandLineFlags = undefined;
        config = { ...defaultConfig, templates: defaultConfig.templates[0].files } as Config;
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
    ])('getIsFileAlreadyExists: is file exists "%s" ? %s', (fileNameTemplate, expected) => {
        expect(
            getIsFileAlreadyExists({
                root,
                fileNameTemplate,
                objectName: 'TestComponent',
                processFileAndFolderName: config.processFileAndFolderName
            })
        ).toEqual(expected);
    });

    it.each([
        ['TestComponent', ['Test', 'Component']],
        ['test-component', ['test', 'component']],
        ['_test__Component__', ['test', 'Component']],
        ['test-component123test', ['test', 'component', '123', 'test']]
    ])('getObjectNameParts: parts from "%s" mast be "%s"', (name, expected) => {
        expect(getObjectNameParts(name)).toEqual(expected);
    });

    const allCases: [TypingCases, string][] = [
        ['camelCase', 'testComponent123'],
        ['PascalCase', 'TestComponent123'],
        ['dash-case', 'test-component-123'],
        ['snake_case', 'test_component_123']
    ];

    it.each(
        allCases
            .map((currentCase) => {
                return allCases.map((c) => [currentCase[1], ...c]);
            })
            .reduce((acc, val) => [...acc, ...val], []) // flat (for nodejs 10)
    )('mapNameToCase: value "%s" in "%s" case must be like "%s"', (name, toCase, expected) => {
        expect(mapNameToCase(name, toCase as TypingCases)).toEqual(expected);
    });

    it.each([
        ['style test component bug', ['style', 'test', 'bug'], false, ['bug']],
        ['bug style component test', ['bug', 'style', 'component', 'test'], true, ['bug']],
        ['bug[123] component test', ['bug', 'component', 'test'], true, ['bug']],
        ['bug component[1] test', ['bug', 'component', 'test'], true, ['bug']],
        ['no', ['no'], false, []]
    ])('getFileTemplates: %s must be converted to %s', (str, templates, withRequired, unexpected) => {
        commandLineFlags = { files: str } as CommandLineFlags;
        const { fileTemplates, undefinedFileTemplates, requiredTemplateNames } = getFileTemplates({
            commandLineFlags,
            withRequired,
            templates: config.templates
        });
        expect(fileTemplates).toEqual(templates);
        expect(undefinedFileTemplates).toEqual(unexpected);
        expect(requiredTemplateNames).toEqual(['index', 'component']);
    });

    it.each([
        ['style test component[0] bug', 'component', 0],
        ['style test component bug[123]', 'bug', 123],
        ['style test component bug[123]', 'test', undefined],
        ['style test component[abd] bug', 'component', undefined]
    ])('getFileIndexForTemplate: "%s" for %s must be %d', (str, template, index) => {
        expect(getFileIndexForTemplate(str, template)).toBe(index);
    });
});
