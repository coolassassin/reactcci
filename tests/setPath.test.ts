import prompts from 'prompts';
import mockFs from 'mock-fs';

import path from 'path';

import { filterChoicesByText, setPath } from '../src/setPath';
import { componentSettingsMap } from '../src/componentSettingsMap';
import { getProjectRootPath } from '../src/getProjectRootPath';
import * as helpers from '../src/helpers';
import { processPath } from '../src/helpers';
import { CommandLineFlags, PartialSetting, Config } from '../src/types';

import { mockConsole, mockProcess } from './testUtils';

jest.mock('../src/componentSettingsMap', () => {
    return {
        componentSettingsMap: {} as PartialSetting
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
    const props: Parameters<typeof setPath>[0] = {
        root: process.cwd(),
        project: '',
        commandLineFlags: {
            dest: ''
        } as CommandLineFlags,
        config: {
            folderPath: 'src/'
        } as Config,
        templateName: 'component'
    };
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (helpers.isDirectory as any) = jest.fn(() => true);

    const { exitMock } = mockProcess();
    mockConsole();

    beforeEach(() => {
        jest.clearAllMocks();
        delete componentSettingsMap.resultPath;
        delete componentSettingsMap.projectRootPath;
        props.commandLineFlags.dest = '';
        mockFs(fsMockFolders);
    });

    afterEach(() => {
        mockFs.restore();
    });

    it('default path', async () => {
        prompts.inject([1]);
        await setPath(props);

        expect(getPath()).toBe(processPath(props.config.folderPath as string));
    });

    it('first folder path', async () => {
        const anyFolderName = Object.keys(fsMockFolders.src)[0];
        prompts.inject([anyFolderName, 1]);
        await setPath(props);

        expect(getPath()).toBe(processPath(path.join(props.config.folderPath as string, anyFolderName)));
    });

    it('first folder and back path', async () => {
        const anyFolderName = Object.keys(fsMockFolders.src)[0];
        prompts.inject([anyFolderName, -1, 1]);
        await setPath(props);

        expect(getPath()).toBe(processPath(props.config.folderPath as string));
    });

    it('manual set', async () => {
        const MANUAL_PATH = 'src/manualPathFolder';
        props.commandLineFlags.dest = MANUAL_PATH;

        prompts.inject([1]);
        await setPath(props);

        expect(getPath()).toBe(MANUAL_PATH);
    });

    it('empty folder', async () => {
        const pathToEmptyFolder = emptyFolderPath;
        props.commandLineFlags.dest = pathToEmptyFolder;
        await setPath(props);
        expect(getPath()).toBe(pathToEmptyFolder);
    });

    it('folder is not exists', async () => {
        props.commandLineFlags.dest = '/src/nonExistentFolder';
        await setPath(props);
        expect(exitMock).toBeCalledTimes(1);
    });

    it('multi-path choice', async () => {
        props.config.folderPath = ['src/folder1', 'src/folder2'];
        prompts.inject([1]);
        await setPath(props);
        expect(getProjectRootPath).toBeCalledTimes(1);
    });

    it('multi-path only one', async () => {
        props.config.folderPath = ['src', 'nonExistentFolder'];
        await setPath(props);
        expect(getProjectRootPath).toBeCalledTimes(0);
        expect(componentSettingsMap.projectRootPath).toBe('src');
    });

    it('multi-path no one', async () => {
        props.config.folderPath = ['nonExistentFolder', 'nonExistentFolder'];
        prompts.inject([1]);
        await setPath(props);
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
