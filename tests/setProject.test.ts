import prompts from 'prompts';

import { setProject } from '../src/setProject';
import * as helpers from '../src/helpers';
import { CommandLineFlags, Config } from '../src/types';

import { mockConsole, mockProcess } from './testUtils';

jest.mock('../src/componentSettingsMap', () => {
    return {
        componentSettingsMap: {}
    };
});

jest.mock('fs', () => {
    return {
        existsSync: (p: string) => !p.includes('NONEXISTENT_FOLDER'),
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
        project: '',
        commandLineFlags: {
            dest: '',
            project: ''
        } as CommandLineFlags,
        config: {
            multiProject: true,
            folderPath: 'Folder1'
        } as Config,
        templateName: 'component'
    };
    const { exitMock } = mockProcess();
    mockConsole();

    beforeEach(() => {
        jest.clearAllMocks();
        delete props.project;
        props.commandLineFlags.dest = '';
        props.commandLineFlags.project = '';
        props.config.folderPath = 'Folder1';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (helpers.isDirectory as any) = jest.fn(() => true);
    });

    it('default project', async () => {
        prompts.inject(['Folder1']);
        expect(await setProject(props)).toBe('Folder1');
    });

    it('wrong project', async () => {
        props.commandLineFlags.project = 'NONEXISTENT_FOLDER';
        await setProject(props);
        expect(exitMock).toBeCalled();
    });

    it('manual project', async () => {
        props.commandLineFlags.project = 'Folder1';
        expect(await setProject(props)).toBe('Folder1');
        expect(exitMock).toHaveBeenCalledTimes(0);
    });

    it('several projects', async () => {
        props.config.folderPath = ['Folder1', 'Folder2'];
        prompts.inject(['Folder1']);
        expect(await setProject(props)).toBe('Folder1');
    });

    it('command line destinations', async () => {
        props.commandLineFlags.dest = 'src/';
        expect(await setProject(props)).toBe('');
    });

    it('no projects exception', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (helpers.isDirectory as any) = jest.fn(() => false);
        await setProject(props);
        expect(exitMock).toBeCalled();
    });

    it('only one project match to folderPath', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (helpers.isDirectory as any) = jest.fn((pathStr: string) => pathStr.includes('Folder1'));
        expect(await setProject(props)).toBe('Folder1');
    });
});
