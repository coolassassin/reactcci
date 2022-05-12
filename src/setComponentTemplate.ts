import Prompt from 'prompts';
import kleur from 'kleur';

import { componentSettingsMap } from './componentSettingsMap';
import { getQuestionsSettings } from './getQuestionsSettings';
import { CommandLineFlags, Config } from './types';

type Properties = {
    config: Config;
    commandLineFlags: CommandLineFlags;
};

export const setComponentTemplate = async ({ commandLineFlags: { template }, config }: Properties): Promise<Config> => {
    const { templates } = config;
    if (Array.isArray(templates)) {
        if (template) {
            if (!templates.map((tmp) => tmp.name).includes(template)) {
                console.error(kleur.red(`Error: There is no ${template} template`));
                process.exit();
                return config;
            }
            componentSettingsMap.templateName = template;
        } else if (templates.length === 1) {
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
            const newConfig = { ...config };
            newConfig.templates = selectedTemplate.files;
            if (selectedTemplate.folderPath) {
                newConfig.folderPath = selectedTemplate.folderPath;
            }
            return newConfig;
        }
    }

    componentSettingsMap.templateName = 'component';
    return config;
};
