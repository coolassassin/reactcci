import Prompt from 'prompts';

import { componentSettingsMap } from './componentSettingsMap';
import { getQuestionsSettings } from './getQuestionsSettings';

export const setComponentTemplate = async () => {
    const {
        config: { templates }
    } = componentSettingsMap;

    if (Array.isArray(templates)) {
        if (templates.length === 1) {
            componentSettingsMap.templateName = templates[0].name;
        } else {
            const { templateName } = await Prompt(
                {
                    type: 'select',
                    name: 'templateName',
                    message: `What would you want to create?`,
                    hint: 'Select using arrows and press Enter',
                    choices: templates.map((tmp) => ({ title: tmp.name, value: tmp.name })),
                    initial: 0
                },
                getQuestionsSettings()
            );
            componentSettingsMap.templateName = templateName;
        }
        const selectedTemplate = templates.find((tmp) => tmp.name === componentSettingsMap.templateName);
        if (selectedTemplate) {
            componentSettingsMap.config.templates = selectedTemplate.files;
            if (selectedTemplate.folderPath) {
                componentSettingsMap.config.folderPath = selectedTemplate.folderPath;
            }
            return;
        }
    }

    componentSettingsMap.templateName = 'component';
};
