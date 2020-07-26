import prompts from 'prompts';

import { setProject } from '../src/setProject';
import { componentSettingsMap } from '../src/componentSettingsMap';
import * as helpers from '../src/helpers';

jest.mock('../src/componentSettingsMap', () => {
    return {
        componentSettingsMap: {
            root: process.cwd(),
            project: '',
            templateName: 'component',
            config: {
                multiProject: true,
                folderPath: 'Folder1'
            },
            commandLineFlags: {
                dest: ''
            }
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
    const exitMock = jest.fn();
    const realProcess = process;
    const realConsole = console;

    beforeEach(() => {
        jest.clearAllMocks();
        global.console = { ...realConsole, error: jest.fn() } as any;
        global.process = { ...realProcess, exit: exitMock, stdout: { ...realProcess.stdout, write: jest.fn() } } as any;
        componentSettingsMap.commandLineFlags.dest = '';
        componentSettingsMap.commandLineFlags.project = '';
        componentSettingsMap.config.folderPath = 'Folder1';
        (helpers.isDirectory as any) = jest.fn(() => true);
    });

    afterEach(() => {
        global.process = realProcess;
        global.console = realConsole;
    });

    it('default project', async () => {
        prompts.inject(['Folder1']);
        await setProject();
        expect(componentSettingsMap.project).toBe('Folder1');
    });

    it('wrong project', async () => {
        componentSettingsMap.commandLineFlags.project = 'NONEXISTENT_FOLDER';
        await setProject();
        expect(exitMock).toBeCalled();
    });

    it('manual project', async () => {
        componentSettingsMap.commandLineFlags.project = 'Folder1';
        await setProject();
        expect(exitMock).toHaveBeenCalledTimes(0);
        expect(componentSettingsMap.project).toBe('Folder1');
    });

    it('several projects', async () => {
        componentSettingsMap.config.folderPath = ['Folder1', 'Folder2'];
        prompts.inject(['Folder1']);
        await setProject();
        expect(componentSettingsMap.project).toBe('Folder1');
    });

    it('command line destinations', async () => {
        componentSettingsMap.commandLineFlags.dest = 'src/';
        await setProject();
        expect(componentSettingsMap.project).toBe('');
    });

    it('command line destinations', async () => {
        (helpers.isDirectory as any) = jest.fn(() => false);
        await setProject();
        expect(exitMock).toBeCalled();
    });
});
