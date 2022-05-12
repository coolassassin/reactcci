import Prompt from 'prompts';

import { getQuestionsSettings } from './getQuestionsSettings';

export const getProjectRootPath = async (paths: string[]): Promise<string> => {
    const { path } = await Prompt(
        {
            type: 'select',
            name: 'path',
            message: `Select path to create component`,
            hint: 'Select using arrows and press Enter',
            choices: paths.map(
                (path): Prompt.Choice => ({
                    title: path.split('/').reverse().find(Boolean) ?? '',
                    value: path,
                    description: path
                })
            ),
            initial: 0
        },
        getQuestionsSettings()
    );

    return path;
};
