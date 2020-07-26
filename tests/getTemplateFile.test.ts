import prompts from 'prompts';

import { FileOption } from '../src/types';
import { getTemplateFile } from '../src/getTemplateFile';

describe('getTemplateFile', () => {
    it('select', async () => {
        const fileOptions: FileOption[] = [
            { name: 'fc.tsx', description: 'Functional component' },
            { name: 'class.tsx', description: 'Class component' }
        ];
        prompts.inject([fileOptions[0]]);
        const selectedFileOption = await getTemplateFile('component', fileOptions);
        expect(selectedFileOption).toEqual(fileOptions[0]);
    });
});
