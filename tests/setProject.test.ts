import prompts from 'prompts';

import { setProject } from '../src/setProject';
import { componentSettingsMap } from '../src/componentSettingsMap';
import * as helpers from '../src/helpers';
import { CommandLineFlags, Config } from '../src/types';

import { mockConsole, mockProcess } from './testUtils';

jest.mock('../src/componentSettingsMap', () => {
    return {
        componentSettingsMap: {
            project: '',
            templateName: 'component'
        }
    };
});

jest.mock('fs', () => {
    return {
        existsSync: (p) => !p.includes('NONEXISTENT_FOLDER'),
        promises: {
            readdir: () => {
                return Promise.resolve(['Folder1', 'Folder2']);
            }
        }
    };
});

describe('setProject', () => {
    const props: Parameters<typeof setProject>[0] = {
        root: process.cwd(),
        commandLineFlags: {
            dest: '',
            project: ''
        } as CommandLineFlags,
        config: {
            multiProject: true,
            folderPath: 'Folder1'
        } as Config
    };
    const { exitMock } = mockProcess();
    mockConsole();

    beforeEach(() => {
        jest.clearAllMocks();
        delete componentSettingsMap.project;
        props.commandLineFlags.dest = '';
        props.commandLineFlags.project = '';
        props.config.folderPath = 'Folder1';
        (helpers.isDirectory as any) = jest.fn(() => true);
    });

    it('default project', async () => {
        prompts.inject(['Folder1']);
        await setProject(props);
        expect(componentSettingsMap.project).toBe('Folder1');
    });

    it('wrong project', async () => {
        props.commandLineFlags.project = 'NONEXISTENT_FOLDER';
        await setProject(props);
        expect(exitMock).toBeCalled();
    });

    it('manual project', async () => {
        props.commandLineFlags.project = 'Folder1';
        await setProject(props);
        expect(exitMock).toHaveBeenCalledTimes(0);
        expect(componentSettingsMap.project).toBe('Folder1');
    });

    it('several projects', async () => {
        props.config.folderPath = ['Folder1', 'Folder2'];
        prompts.inject(['Folder1']);
        await setProject(props);
        expect(componentSettingsMap.project).toBe('Folder1');
    });

    it('command line destinations', async () => {
        props.commandLineFlags.dest = 'src/';
        await setProject(props);
        expect(componentSettingsMap.project).toBe('');
    });

    it('no projects exception', async () => {
        (helpers.isDirectory as any) = jest.fn(() => false);
        await setProject(props);
        expect(exitMock).toBeCalled();
    });

    it('only one project match to folderPath', async () => {
        (helpers.isDirectory as any) = jest.fn((pathStr: string) => pathStr.includes('Folder1'));
        await setProject(props);
        expect(componentSettingsMap.project).toBe('Folder1');
    });
});
