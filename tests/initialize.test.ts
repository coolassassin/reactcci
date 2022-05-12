import prompts from 'prompts';
import mockFs from 'mock-fs';

import fs from 'fs';
import path from 'path';

import { initialize } from '../src/initialize';
import * as consts from '../src/constants';
import { CommandLineFlags } from '../src/types';

import { mockProcess } from './testUtils';

jest.mock('../src/componentSettingsMap', () => {
    return {
        componentSettingsMap: {
            moduleRoot: '',
            project: '',
            templateName: 'component'
        }
    };
});

describe('initialize', () => {
    const props: Parameters<typeof initialize>[0] = {
        root: process.cwd(),
        moduleRoot: '',
        commandLineFlags: {
            nfc: false
        } as CommandLineFlags
    };
    const mkdirSpy = jest.spyOn(fs.promises, 'mkdir');
    const configFileName = consts.CONFIG_FILE_NAME;
    const existentConfigName = 'existent.config.js';
    const fsMockFolders = {
        node_modules: mockFs.load(path.resolve(__dirname, '../node_modules')),
        templates: mockFs.load(path.resolve(__dirname, '../templates')),
        templatesFolder: {},
        'defaultConfig.js': '',
        [existentConfigName]: ''
    };

    mockProcess();

    beforeEach(() => {
        jest.clearAllMocks();
        (consts.CONFIG_FILE_NAME as any) = configFileName;
        mockFs(fsMockFolders);
    });

    afterAll(() => {
        mockFs.restore();
    });

    it('config exists, skip everything', async () => {
        (consts.CONFIG_FILE_NAME as any) = existentConfigName;
        const result = await initialize(props);
        expect(result).toBeUndefined();
    });

    it('config not exists, yes to everything', async () => {
        prompts.inject([true, true, 'templatesFolder']);
        const result = await initialize(props);
        expect(result).toBeUndefined();
        expect(mkdirSpy).toBeCalledTimes(0);
    });

    it('config not exists, disagree', async () => {
        prompts.inject([false]);
        const result = await initialize(props);
        expect(result).toBeUndefined();
    });

    it('config not exists, agree but create a folder for templates', async () => {
        const newTemplatesFolder = 'non-existent-template-folder';
        prompts.inject([true, true, newTemplatesFolder]);
        await initialize(props);
        expect(mkdirSpy).toBeCalledTimes(1);
        expect(fs.existsSync(path.resolve(__dirname, '../', newTemplatesFolder))).toBe(true);
    });

    it('config not exists, disagree about folder for templates', async () => {
        prompts.inject([true, false]);
        const result = await initialize(props);
        expect(result).toBeUndefined();
        expect(mkdirSpy).toBeCalledTimes(0);
    });
});
