import prompts from 'prompts';

import { getTemplateNamesToCreate } from '../src/getTemplateNamesToCreate';
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
});
