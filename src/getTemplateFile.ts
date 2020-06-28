import Prompt from 'prompts';
import { getQuestionsSettings } from './getQuestionsSettings';
import kleur from 'kleur';

export const getTemplateFile = async (name, files) => {
    const { file } = await Prompt(
        {
            type: 'select',
            name: 'file',
            message: `Select type of ${kleur.yellow(name)} file`,
            hint: 'Select using arrows and press Enter',
            choices: files.map((file) => ({ title: file.description, value: file })),
            initial: 0,
        },
        getQuestionsSettings()
    );

    return file;
};
