import Prompt from 'prompts';

import { getQuestionsSettings } from './getQuestionsSettings';
import { componentSettingsMap } from './componentSettingsMap';
import { TEMPLATE_NAMES_SELECTING_INSTRUCTIONS } from './constants';

export const getTemplateNamesToCreate = async () => {
    const { config } = componentSettingsMap;

    const templesToSelect = Object.entries(config.templates).filter(([, options]) => options.optional);
    let selectedTemplateNames = [];
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

    return [
        ...Object.entries(config.templates)
            .filter(([, options]) => !options.optional)
            .map(([name]) => name),
        ...selectedTemplateNames
    ];
};
