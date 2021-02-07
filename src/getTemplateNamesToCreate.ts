import Prompt from 'prompts';

import { getQuestionsSettings } from './getQuestionsSettings';
import { componentSettingsMap } from './componentSettingsMap';
import { TEMPLATE_NAMES_SELECTING_INSTRUCTIONS } from './constants';

export const getTemplateNamesToCreate = async () => {
    const { config, commandLineFlags } = componentSettingsMap;
    const requiredTemplateNames = Object.entries(config.templates)
        .filter(([, options]) => !options.optional)
        .map(([name]) => name);

    let selectedTemplateNames: string[] = [];

    if (commandLineFlags.files) {
        const fileTemplates = commandLineFlags.files.split(' ').filter((tmp) => !requiredTemplateNames.includes(tmp));
        if (!fileTemplates.includes('no')) {
            const undefinedFileTemplates = fileTemplates.filter(
                (tmp) => !Object.prototype.hasOwnProperty.call(config.templates, tmp)
            );

            if (undefinedFileTemplates.length > 0) {
                console.error('Error: Undefined file templates:');
                console.error(undefinedFileTemplates.join('\n'));
                process.exit();
                return;
            }
        }

        selectedTemplateNames = fileTemplates;
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
