import prompts from 'prompts';

import { FileOption } from '../src/types';
import { getTemplateFile } from '../src/getTemplateFile';
import { componentSettingsMap } from '../src/componentSettingsMap';

import { mockConsole, mockProcess } from './testUtils';

jest.mock('../src/componentSettingsMap', () => {
    return {
        componentSettingsMap: {
            commandLineFlags: {
                files: ''
            }
        }
    };
});

describe('getTemplateFile', () => {
    const { exitMock } = mockProcess();
    mockConsole();

    beforeEach(() => {
        componentSettingsMap.commandLineFlags.files = '';
    });

    it('select by prompt', async () => {
        const fileOptions: FileOption[] = [
            { name: 'fc.tsx', description: 'Functional component' },
            { name: 'class.tsx', description: 'Class component' }
        ];
        prompts.inject([fileOptions[0]]);
        const selectedFileOption = await getTemplateFile('component', fileOptions);
        expect(selectedFileOption).toEqual(fileOptions[0]);
    });

    it('select by command line', async () => {
        const fileOptions: FileOption[] = [
            { name: 'fc.tsx', description: 'Functional component' },
            { name: 'class.tsx', description: 'Class component' }
        ];
        componentSettingsMap.commandLineFlags.files = 'style component[0] test';
        const selectedFileOption = await getTemplateFile('component', fileOptions);
        expect(selectedFileOption).toEqual(fileOptions[0]);
    });

    it('wrong select by command line', async () => {
        const fileOptions: FileOption[] = [
            { name: 'fc.tsx', description: 'Functional component' },
            { name: 'class.tsx', description: 'Class component' }
        ];
        componentSettingsMap.commandLineFlags.files = 'style component[2] test';
        await getTemplateFile('component', fileOptions);
        expect(exitMock).toBeCalled();
    });
});
