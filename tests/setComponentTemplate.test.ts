import prompts from 'prompts';

import { setComponentTemplate } from '../src/setComponentTemplate';
import { componentSettingsMap } from '../src/componentSettingsMap';
import { CommandLineFlags } from '../src/types';

import { mockConsole, mockProcess } from './testUtils';

jest.mock('../src/componentSettingsMap', () => {
    return {
        componentSettingsMap: {
            config: {
                templates: {}
            }
        }
    };
});

describe('getFinalAgreement', () => {
    const props: Parameters<typeof setComponentTemplate>[0] = {
        commandLineFlags: {
            template: ''
        } as CommandLineFlags
    };
    const { exitMock } = mockProcess();
    mockConsole();

    beforeEach(() => {
        componentSettingsMap.config.templates = {};
    });

    it('basic config with component template', async () => {
        await setComponentTemplate(props);
        expect(componentSettingsMap.templateName).toBe('component');
    });

    it('config with array of components but with only one', async () => {
        componentSettingsMap.config.templates = [
            {
                name: 'service',
                files: {}
            }
        ];
        await setComponentTemplate(props);
        expect(componentSettingsMap.templateName).toBe('service');
    });

    it('config with array and select', async () => {
        componentSettingsMap.config.templates = [
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
        componentSettingsMap.config.templates = [
            {
                name: 'service',
                folderPath: 'src/components/',
                files: {}
            }
        ];
        await setComponentTemplate(props);
        expect(componentSettingsMap.templateName).toBe('service');
        expect(componentSettingsMap.config.folderPath).toBe('src/components/');
    });

    it('config with array and wrong commandline flag', async () => {
        props.commandLineFlags.template = 'cmp';
        componentSettingsMap.config.templates = [
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
        componentSettingsMap.config.templates = [
            {
                name: 'component',
                files: {}
            }
        ];
        await setComponentTemplate(props);
        expect(componentSettingsMap.templateName).toBe('component');
    });
});
