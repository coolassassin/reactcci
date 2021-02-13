import Prompt from 'prompts';
import kleur from 'kleur';

import { componentSettingsMap } from './componentSettingsMap';
import { getQuestionsSettings } from './getQuestionsSettings';
import { FileOption } from './types';
import { getFileIndexForTemplate } from './helpers';

export const getTemplateFile = async (name: string, files: FileOption[]) => {
    const { commandLineFlags } = componentSettingsMap;

    if (commandLineFlags.files) {
        const index = getFileIndexForTemplate(commandLineFlags.files, name);

        if (typeof index !== 'undefined') {
            if (!files[index]) {
                console.error(kleur.red(`Error: ${kleur.yellow(index)} is incorrect index for ${kleur.yellow(name)}`));
                console.error(`Max value is: ${kleur.yellow(files.length - 1)}`);
                process.exit();
            }

            return files[index];
        }
    }

    const { file } = await Prompt(
        {
            type: 'select',
            name: 'file',
            message: `Select type of ${kleur.reset().yellow(name)} file`,
            hint: 'Select using arrows and press Enter',
            choices: files.map((file) => ({ title: file.description, value: file })),
            initial: 0
        },
        getQuestionsSettings()
    );

    return file;
};
