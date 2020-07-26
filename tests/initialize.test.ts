import prompts from 'prompts';

import fs from 'fs';

import { initialize } from '../src/initialize';
import * as consts from '../src/constants';

jest.mock('../src/componentSettingsMap', () => {
    return {
        componentSettingsMap: {
            root: process.cwd(),
            moduleRoot: '',
            project: '',
            templateName: 'component'
        }
    };
});

jest.mock('fs', () => {
    return {
        existsSync: (path: string) =>
            !path.endsWith('undefined-config-path.js') && !path.endsWith('non-existent-template-folder'),
        promises: {
            readFile: () => ({
                toString: () => ''
            }),
            writeFile: jest.fn(),
            readdir: jest.fn(() => Promise.resolve(['fs.tsx', 'class.tsx'])),
            mkdir: jest.fn()
        }
    };
});

describe('initialize', () => {
    const exitMock = jest.fn();
    const realProcess = process;
    const configFileName = consts.CONFIG_FILE_NAME;

    beforeEach(() => {
        jest.clearAllMocks();
        (consts.CONFIG_FILE_NAME as any) = configFileName;
        global.process = { ...realProcess, exit: exitMock, stdout: { ...realProcess.stdout, write: jest.fn() } } as any;
    });

    it('no config, yes to everything', async () => {
        (consts.CONFIG_FILE_NAME as any) = 'undefined-config-path.js';
        prompts.inject([true, 'templates']);
        await initialize();
    });

    it('config exists, yes to everything', async () => {
        prompts.inject([true, true, 'templates']);
        await initialize();
    });

    it('config exists, disagree', async () => {
        prompts.inject([false]);
        await initialize();
        expect(exitMock).toBeCalledTimes(1);
    });

    it('config exists, agree but create a folder for templates', async () => {
        prompts.inject([true, true, 'non-existent-template-folder']);
        await initialize();
        expect(fs.promises.mkdir).toBeCalledTimes(1);
    });

    it('config exists, disagree about folder for templates', async () => {
        prompts.inject([true, false]);
        await initialize();
        expect(exitMock).toBeCalledTimes(1);
    });
});
