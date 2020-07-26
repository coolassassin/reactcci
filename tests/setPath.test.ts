import prompts from 'prompts';

import path from 'path';

import { filterChoicesByText, setPath } from '../src/setPath';
import { componentSettingsMap } from '../src/componentSettingsMap';
import { getProjectRootPath } from '../src/getProjectRootPath';
import * as helpers from '../src/helpers';

jest.mock('../src/componentSettingsMap', () => {
    return {
        componentSettingsMap: {
            root: process.cwd(),
            project: '',
            config: {
                folderPath: 'tests'
            },
            commandLineFlags: {
                dest: ''
            }
        }
    };
});

jest.mock('fs', () => {
    return {
        existsSync: (path: string) => !path.endsWith('nonExistentFolder'),
        promises: {
            stat: (path: string) => {
                if (path.endsWith('nonExistentFolder')) {
                    return Promise.reject();
                }
                return Promise.resolve({});
            },
            readdir: (path: string) => {
                if (path.endsWith('emptyFolder')) {
                    return Promise.resolve([]);
                }
                return Promise.resolve(['folder1', 'folder2']);
            }
        }
    };
});

jest.mock('../src/getProjectRootPath', () => {
    return {
        getProjectRootPath: jest.fn(() => 'tests')
    };
});

const anyFolderName = 'TestComponent';

const getPath = () => {
    const { projectRootPath, resultPath } = componentSettingsMap;
    return path
        .join(projectRootPath, resultPath)
        .replace(/[\\/]$/g, '')
        .replace(/\\/g, '/');
};

describe('setPath', () => {
    const exitMock = jest.fn();
    const consoleErrorMock = jest.fn();
    const realProcess = process;
    const realConsole = console;

    (helpers.isDirectory as any) = jest.fn(() => true);

    beforeEach(() => {
        jest.clearAllMocks();
        global.console = { ...realConsole, error: consoleErrorMock } as any;
        global.process = { ...realProcess, exit: exitMock } as any;
        componentSettingsMap.commandLineFlags.dest = '';
    });

    it('default path', async () => {
        prompts.inject([1]);
        await setPath();

        expect(getPath()).toBe(componentSettingsMap.config.folderPath);
    });

    it('first folder path', async () => {
        prompts.inject([anyFolderName, 1]);
        await setPath();

        expect(getPath()).toBe(`${componentSettingsMap.config.folderPath}/${anyFolderName}`);
    });

    it('first folder and back path', async () => {
        prompts.inject([anyFolderName, -1, 1]);
        await setPath();

        expect(getPath()).toBe(componentSettingsMap.config.folderPath);
    });

    it('manual set', async () => {
        const MANUAL_PATH = 'RA/Static/Scripts';
        componentSettingsMap.commandLineFlags.dest = MANUAL_PATH;

        prompts.inject([1]);
        await setPath();

        expect(getPath()).toBe(MANUAL_PATH);
    });

    it('empty folder', async () => {
        const pathToEmptyFolder = 'some/path/to/emptyFolder';
        componentSettingsMap.commandLineFlags.dest = pathToEmptyFolder;
        await setPath();
        expect(getPath()).toBe(pathToEmptyFolder);
    });

    it('folder is not exists', async () => {
        const nonExistentFolder = '/src/nonExistentFolder';
        componentSettingsMap.commandLineFlags.dest = nonExistentFolder;
        prompts.inject([1]);
        await setPath();
        expect(exitMock).toBeCalledTimes(1);
    });

    it('multi-path choice', async () => {
        componentSettingsMap.config.folderPath = ['test1', 'test2'];
        prompts.inject([1]);
        await setPath();
        expect(getProjectRootPath).toBeCalledTimes(1);
    });

    it('multi-path only one', async () => {
        componentSettingsMap.config.folderPath = ['test1', 'nonExistentFolder'];
        prompts.inject([1]);
        await setPath();
        expect(getProjectRootPath).toBeCalledTimes(0);
    });

    it('multi-path no one', async () => {
        componentSettingsMap.config.folderPath = ['nonExistentFolder', 'nonExistentFolder'];
        prompts.inject([1]);
        await setPath();
        expect(exitMock).toBeCalledTimes(1);
    });

    it('filterChoicesByText', () => {
        const mapStringsToTitles = (str: string[]) => str.map((s) => ({ title: s }));
        expect(
            filterChoicesByText(mapStringsToTitles(['>> Here <<', 'folder', 'item', 'folder2']), 'item', true)
        ).toEqual(mapStringsToTitles(['>> Here <<', 'item']));
        expect(
            filterChoicesByText(
                mapStringsToTitles(['< Back', '>> Here <<', 'folder', 'item', 'folder2']),
                'item',
                false
            )
        ).toEqual(mapStringsToTitles(['< Back', '>> Here <<', 'item']));
    });
});
