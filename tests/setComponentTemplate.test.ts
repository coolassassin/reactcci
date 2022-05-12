import prompts from 'prompts';

import { setComponentTemplate } from '../src/setComponentTemplate';
import { componentSettingsMap } from '../src/componentSettingsMap';
import { CommandLineFlags, Config } from '../src/types';

import { mockConsole, mockProcess } from './testUtils';

jest.mock('../src/componentSettingsMap', () => {
    return {
        componentSettingsMap: {}
    };
});

describe('getFinalAgreement', () => {
    const props: Parameters<typeof setComponentTemplate>[0] = {
        config: {
            templates: {}
        } as Config,
        commandLineFlags: {
            template: ''
        } as CommandLineFlags
    };
    const { exitMock } = mockProcess();
    mockConsole();

    beforeEach(() => {
        props.config.templates = {};
    });

    it('basic config with component template', async () => {
        await setComponentTemplate(props);
        expect(componentSettingsMap.templateName).toBe('component');
    });

    it('config with array of components but with only one', async () => {
        props.config.templates = [
            {
                name: 'service',
                files: {}
            }
        ];
        await setComponentTemplate(props);
        expect(componentSettingsMap.templateName).toBe('service');
    });

    it('config with array and select', async () => {
        props.config.templates = [
            {
                name: 'component',
                files: {}
            },
            {
                name: 'service',
                files: {}
            }
        ];
        prompts.inject(['service']);
        await setComponentTemplate(props);
        expect(componentSettingsMap.templateName).toBe('service');
    });

    it('config with array and unique folder path', async () => {
        props.config.templates = [
            {
                name: 'service',
                folderPath: 'src/components/',
                files: {}
            }
        ];
        const newConfig = await setComponentTemplate(props);
        expect(componentSettingsMap.templateName).toBe('service');
        expect(newConfig.folderPath).toBe('src/components/');
    });

    it('config with array and wrong commandline flag', async () => {
        props.commandLineFlags.template = 'cmp';
        props.config.templates = [
            {
                name: 'component',
                files: {}
            }
        ];
        await setComponentTemplate(props);
        expect(exitMock).toBeCalled();
    });

    it('config with array and right commandline flag', async () => {
        props.commandLineFlags.template = 'component';
        props.config.templates = [
            {
                name: 'component',
                files: {}
            }
        ];
        await setComponentTemplate(props);
        expect(componentSettingsMap.templateName).toBe('component');
    });
});
