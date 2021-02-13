import prompts from 'prompts';

import { getTemplateNamesToCreate } from '../src/getTemplateNamesToCreate';
import { componentSettingsMap } from '../src/componentSettingsMap';
import { PartialSetting } from '../src/types';

import { mockConsole, mockProcess } from './testUtils';

jest.mock('../src/componentSettingsMap', () => {
    return {
        componentSettingsMap: {
            config: {
                templates: {}
            },
            commandLineFlags: {
                files: ''
            }
        } as PartialSetting
    };
});

describe('getTemplateNamesToCreate', () => {
    mockConsole();
    const { exitMock } = mockProcess();

    beforeEach(() => {
        componentSettingsMap.config.templates = {};
        componentSettingsMap.commandLineFlags.files = '';
    });

    it('no optional', async () => {
        componentSettingsMap.config.templates = {
            index: {
                name: 'index.ts',
                file: 'index.ts'
            }
        };
        const res = await getTemplateNamesToCreate();
        expect(res).toEqual(['index']);
    });

    it('with optional and without selection', async () => {
        componentSettingsMap.config.templates = {
            file1: {
                name: 'index.ts',
                file: 'index.ts'
            },
            file2: {
                name: 'index.ts',
                file: 'index.ts',
                optional: true
            }
        };
        prompts.inject([[]]);
        const res = await getTemplateNamesToCreate();
        expect(res).toEqual(['file1']);
    });

    it('with optional and with selection', async () => {
        componentSettingsMap.config.templates = {
            file1: {
                name: 'index.ts',
                file: 'index.ts'
            },
            file2: {
                name: 'index.ts',
                file: 'index.ts',
                optional: true
            }
        };
        prompts.inject([['file2']]);
        const res = await getTemplateNamesToCreate();
        expect(res).toEqual(['file1', 'file2']);
    });

    it('command line selection', async () => {
        componentSettingsMap.config.templates = {
            file1: {
                name: 'index.ts',
                file: 'index.ts'
            },
            file2: {
                name: 'index.ts',
                file: 'index.ts',
                optional: true
            }
        };
        componentSettingsMap.commandLineFlags.files = 'file2[1]';
        const res = await getTemplateNamesToCreate();
        expect(res).toEqual(['file1', 'file2']);
    });

    it('command line selection with no', async () => {
        componentSettingsMap.config.templates = {
            file1: {
                name: 'index.ts',
                file: 'index.ts'
            },
            file2: {
                name: 'index.ts',
                file: 'index.ts',
                optional: true
            }
        };
        componentSettingsMap.commandLineFlags.files = 'no';
        const res = await getTemplateNamesToCreate();
        expect(res).toEqual(['file1']);
    });

    it('command line selection with unexpected filename', async () => {
        componentSettingsMap.config.templates = {
            file1: {
                name: 'index.ts',
                file: 'index.ts'
            },
            file2: {
                name: 'index.ts',
                file: 'index.ts',
                optional: true
            }
        };
        componentSettingsMap.commandLineFlags.files = 'unexpected';
        await getTemplateNamesToCreate();
        expect(exitMock).toBeCalled();
    });
});
