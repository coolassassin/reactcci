import prompts from 'prompts';

import { setComponentTemplate } from '../src/setComponentTemplate';
import { componentSettingsMap } from '../src/componentSettingsMap';

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
    beforeEach(() => {
        componentSettingsMap.config.templates = {};
    });

    it('basic config with component template', async () => {
        await setComponentTemplate();
        expect(componentSettingsMap.templateName).toBe('component');
    });

    it('config with array of components but with only one', async () => {
        componentSettingsMap.config.templates = [
            {
                name: 'service',
                files: {}
            }
        ];
        await setComponentTemplate();
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
        await setComponentTemplate();
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
        await setComponentTemplate();
        expect(componentSettingsMap.templateName).toBe('service');
        expect(componentSettingsMap.config.folderPath).toBe('src/components/');
    });
});
