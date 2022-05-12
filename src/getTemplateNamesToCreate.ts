import Prompt from 'prompts';

import { getQuestionsSettings } from './getQuestionsSettings';
import { TEMPLATE_NAMES_SELECTING_INSTRUCTIONS } from './constants';
import { getFileTemplates } from './helpers';
import { CommandLineFlags, Config } from './types';

type Properties = {
    commandLineFlags: CommandLineFlags;
    config: Config;
};

export const getTemplateNamesToCreate = async ({ commandLineFlags, config: { templates } }: Properties) => {
    const { fileTemplates, undefinedFileTemplates, requiredTemplateNames } = getFileTemplates({
        commandLineFlags,
        templates
    });

    let selectedTemplateNames: string[] = [];
    if (commandLineFlags.files) {
        if (undefinedFileTemplates.length > 0) {
            console.error('Error: Undefined file templates:');
            console.error(undefinedFileTemplates.join('\n'));
            process.exit();
            return;
        }
        if (!fileTemplates.includes('no')) {
            selectedTemplateNames = fileTemplates;
        }
    } else {
        const templesToSelect = Object.entries(templates).filter(([, options]) => options.optional);
        if (templesToSelect.length) {
            selectedTemplateNames = (
                await Prompt(
                    {
                        type: 'multiselect',
                        name: 'templateNames',
                        message: 'Select files to generate',
                        instructions: TEMPLATE_NAMES_SELECTING_INSTRUCTIONS,
                        choices: templesToSelect.map(([name, options]) => {
                            const { default: selected = true } = options;
                            return { title: name, value: name, selected };
                        })
                    },
                    getQuestionsSettings()
                )
            ).templateNames;
        }
    }

    return [...requiredTemplateNames, ...selectedTemplateNames];
};
