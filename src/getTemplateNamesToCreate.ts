import Prompt from 'prompts';

import { getQuestionsSettings } from './getQuestionsSettings';
import { componentSettingsMap } from './componentSettingsMap';
import { TEMPLATE_NAMES_SELECTING_INSTRUCTIONS } from './constants';
import { getFileTemplates } from './helpers';
import { CommandLineFlags } from './types';

type Properties = {
    commandLineFlags: CommandLineFlags;
};

export const getTemplateNamesToCreate = async ({ commandLineFlags }: Properties) => {
    const { config } = componentSettingsMap;

    const { fileTemplates, undefinedFileTemplates, requiredTemplateNames } = getFileTemplates({ commandLineFlags });

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
        const templesToSelect = Object.entries(config.templates).filter(([, options]) => options.optional);
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
