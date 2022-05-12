import prompts from 'prompts';

import { CommandLineFlags } from '../src/types';
import { getTemplateFile } from '../src/getTemplateFile';

import { mockConsole, mockProcess } from './testUtils';

describe('getTemplateFile', () => {
    const props: Parameters<typeof getTemplateFile>[0] = {
        name: 'component',
        files: [],
        commandLineFlags: {
            files: ''
        } as CommandLineFlags
    };

    const { exitMock } = mockProcess();
    mockConsole();

    beforeEach(() => {
        props.files = [];
        props.commandLineFlags.files = '';
    });

    it('select by prompt', async () => {
        props.files = [
            { name: 'fc.tsx', description: 'Functional component' },
            { name: 'class.tsx', description: 'Class component' }
        ];
        prompts.inject([props.files[0]]);
        const selectedFileOption = await getTemplateFile(props);
        expect(selectedFileOption).toEqual(props.files[0]);
    });

    it('select by command line', async () => {
        props.files = [
            { name: 'fc.tsx', description: 'Functional component' },
            { name: 'class.tsx', description: 'Class component' }
        ];
        props.commandLineFlags.files = 'style component[0] test';
        const selectedFileOption = await getTemplateFile(props);
        expect(selectedFileOption).toEqual(props.files[0]);
    });

    it('wrong select by command line', async () => {
        props.files = [
            { name: 'fc.tsx', description: 'Functional component' },
            { name: 'class.tsx', description: 'Class component' }
        ];
        props.commandLineFlags.files = 'style component[2] test';
        await getTemplateFile(props);
        expect(exitMock).toBeCalled();
    });
});
