import Prompt from 'prompts';
import { getQuestionsSettings } from './getQuestionsSettings';

export const getProjectRootPath = async (paths) => {
    const { path } = await Prompt(
        {
            type: 'select',
            name: 'path',
            message: `Select path to create component`,
            hint: 'Select using arrows and press Enter',
            choices: paths.map((path) => ({
                title: path
                    .split('/')
                    .reverse()
                    .find((p) => p),
                value: path,
                description: path,
            })),
            initial: 0,
        },
        getQuestionsSettings()
    );

    return path;
};
