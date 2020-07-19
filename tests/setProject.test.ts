import prompts from 'prompts';

import { setProject } from '../src/setProject';
import { componentSettingsMap } from '../src/componentSettingsMap';

jest.mock('../src/componentSettingsMap', () => {
    return {
        componentSettingsMap: {
            root: process.cwd(),
            project: '',
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

jest.mock('../src/helpers', () => {
    return {
        isDirectory: () => true
    };
});

jest.mock('fs', () => {
    return {
        existsSync: (p) => !p.includes('NONEXISTENT_FOLDER'),
        promises: {
            readdir: () => {
                return Promise.resolve(['Folder1']);
            }
        }
    };
});

describe('setProject', () => {
    let exitMock = jest.fn();
    const realProcess = process;
    const realConsole = console;

    beforeEach(() => {
        exitMock = jest.fn();
        global.console = { ...realConsole, error: jest.fn(), log: jest.fn() } as any;
        global.process = { ...realProcess, exit: exitMock } as any;
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
});
