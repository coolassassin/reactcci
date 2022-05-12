import prompts from 'prompts';

import { getTemplateNamesToCreate } from '../src/getTemplateNamesToCreate';
import { CommandLineFlags, PartialSetting, Config } from '../src/types';

import { mockConsole, mockProcess } from './testUtils';

jest.mock('../src/componentSettingsMap', () => {
    return {
        componentSettingsMap: {
            config: {
                templates: {}
            }
        } as PartialSetting
    };
});

describe('getTemplateNamesToCreate', () => {
    const props: Parameters<typeof getTemplateNamesToCreate>[0] = {
        commandLineFlags: {
            files: ''
        } as CommandLineFlags,
        config: {
            templates: {}
        } as Config
    };
    mockConsole();
    const { exitMock } = mockProcess();

    beforeEach(() => {
        props.config.templates = {};
        props.commandLineFlags.files = '';
    });

    it('no optional', async () => {
        props.config.templates = {
            index: {
                name: 'index.ts',
                file: 'index.ts'
            }
        };
        const res = await getTemplateNamesToCreate(props);
        expect(res).toEqual(['index']);
    });

    it('with optional and without selection', async () => {
        props.config.templates = {
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
        const res = await getTemplateNamesToCreate(props);
        expect(res).toEqual(['file1']);
    });

    it('with optional and with selection', async () => {
        props.config.templates = {
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
        const res = await getTemplateNamesToCreate(props);
        expect(res).toEqual(['file1', 'file2']);
    });

    it('command line selection', async () => {
        props.config.templates = {
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
        props.commandLineFlags.files = 'file2[1]';
        const res = await getTemplateNamesToCreate(props);
        expect(res).toEqual(['file1', 'file2']);
    });

    it('command line selection with no', async () => {
        props.config.templates = {
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
        props.commandLineFlags.files = 'no';
        const res = await getTemplateNamesToCreate(props);
        expect(res).toEqual(['file1']);
    });

    it('command line selection with unexpected filename', async () => {
        props.config.templates = {
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
        props.commandLineFlags.files = 'unexpected';
        await getTemplateNamesToCreate(props);
        expect(exitMock).toBeCalled();
    });
});
