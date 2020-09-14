import prompts from 'prompts';
import mockFs from 'mock-fs';

import path from 'path';

import { filterChoicesByText, setPath } from '../src/setPath';
import { componentSettingsMap } from '../src/componentSettingsMap';
import { getProjectRootPath } from '../src/getProjectRootPath';
import * as helpers from '../src/helpers';
import { processPath } from '../src/helpers';

jest.mock('../src/componentSettingsMap', () => {
    return {
        componentSettingsMap: {
            root: process.cwd(),
            project: '',
            config: {
                folderPath: 'src/'
            },
            commandLineFlags: {
                dest: ''
            }
        }
    };
});

const emptyFolderPath = 'some/path/to/emptyFolder';

jest.mock('../src/getProjectRootPath', () => {
    return {
        getProjectRootPath: jest.fn(() => 'src')
    };
});

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
    const fsMockFolders = {
        node_modules: mockFs.load(path.resolve(__dirname, '../node_modules')),
        src: {
            folder1: {
                Component1: {}
            },
            folder2: {
                Component2: {}
            },
            manualPathFolder: {}
        },
        [emptyFolderPath]: {}
    };

    (helpers.isDirectory as any) = jest.fn(() => true);

    beforeEach(() => {
        jest.clearAllMocks();
        global.console = { ...realConsole, error: consoleErrorMock } as any;
        global.process = { ...realProcess, exit: exitMock } as any;
        componentSettingsMap.commandLineFlags.dest = '';
        mockFs(fsMockFolders);
    });

    afterEach(() => {
        mockFs.restore();
    });

    it('default path', async () => {
        prompts.inject([1]);
        await setPath();

        expect(getPath()).toBe(processPath(componentSettingsMap.config.folderPath as string));
    });

    it('first folder path', async () => {
        const anyFolderName = Object.keys(fsMockFolders.src)[0];
        prompts.inject([anyFolderName, 1]);
        await setPath();

        expect(getPath()).toBe(processPath(path.join(componentSettingsMap.config.folderPath as string, anyFolderName)));
    });

    it('first folder and back path', async () => {
        const anyFolderName = Object.keys(fsMockFolders.src)[0];
        prompts.inject([anyFolderName, -1, 1]);
        await setPath();

        expect(getPath()).toBe(processPath(componentSettingsMap.config.folderPath as string));
    });

    it('manual set', async () => {
        const MANUAL_PATH = 'src/manualPathFolder';
        componentSettingsMap.commandLineFlags.dest = MANUAL_PATH;

        prompts.inject([1]);
        await setPath();

        expect(getPath()).toBe(MANUAL_PATH);
    });

    it('empty folder', async () => {
        const pathToEmptyFolder = emptyFolderPath;
        componentSettingsMap.commandLineFlags.dest = pathToEmptyFolder;
        await setPath();
        expect(getPath()).toBe(pathToEmptyFolder);
    });

    it('folder is not exists', async () => {
        componentSettingsMap.commandLineFlags.dest = '/src/nonExistentFolder';
        await setPath();
        expect(exitMock).toBeCalledTimes(1);
    });

    it('multi-path choice', async () => {
        componentSettingsMap.config.folderPath = ['src/folder1', 'src/folder2'];
        prompts.inject([1]);
        await setPath();
        expect(getProjectRootPath).toBeCalledTimes(1);
    });

    it('multi-path only one', async () => {
        componentSettingsMap.config.folderPath = ['src', 'nonExistentFolder'];
        await setPath();
        expect(getProjectRootPath).toBeCalledTimes(0);
        expect(componentSettingsMap.projectRootPath).toBe('src');
    });

    it('multi-path no one', async () => {
        componentSettingsMap.config.folderPath = ['nonExistentFolder', 'nonExistentFolder'];
        prompts.inject([1]);
        await setPath();
        expect(exitMock).toBeCalledTimes(1);
    });

    it('filterChoicesByText', () => {
        const mapStringsToTitles = (str: string[]) => str.map((s) => ({ title: s }));
        expect(filterChoicesByText(mapStringsToTitles(['>> Here <<', 'folder', 'item', 'folder2']), '', true)).toEqual(
            mapStringsToTitles(['>> Here <<', 'folder', 'item', 'folder2'])
        );
        expect(
            filterChoicesByText(mapStringsToTitles(['>> Here <<', 'folder', 'item', 'folder2']), 'item', true)
        ).toEqual(mapStringsToTitles(['item']));
        expect(
            filterChoicesByText(
                mapStringsToTitles(['< Back', '>> Here <<', 'folder', 'item', 'folder2']),
                'item',
                false
            )
        ).toEqual(mapStringsToTitles(['item']));
        expect(
            filterChoicesByText(mapStringsToTitles(['< Back', '>> Here <<', 'folder', 'item', 'folder2']), 'b', false)
        ).toEqual(mapStringsToTitles([]));
    });
});
