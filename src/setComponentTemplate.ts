import Prompt from 'prompts';
import kleur from 'kleur';

import { getQuestionsSettings } from './getQuestionsSettings';
import { CommandLineFlags, Config } from './types';

type Properties = {
    config: Config;
    commandLineFlags: CommandLineFlags;
};

type Output = {
    config: Config;
    templateName: string;
};

export const setComponentTemplate = async ({ commandLineFlags: { template }, config }: Properties): Promise<Output> => {
    const { templates } = config;
    let templateName = 'component';
    if (Array.isArray(templates)) {
        if (template) {
            if (!templates.map((tmp) => tmp.name).includes(template)) {
                console.error(kleur.red(`Error: There is no ${template} template`));
                process.exit();
                return { config, templateName };
            }
            templateName = template;
        } else if (templates.length === 1) {
            templateName = templates[0].name;
        } else {
            const { selectedTemplateName } = await Prompt(
                {
                    type: 'select',
                    name: 'selectedTemplateName',
                    message: `What would you want to create?`,
                    hint: 'Select using arrows and press Enter',
                    choices: templates.map((tmp) => ({ title: tmp.name, value: tmp.name })),
                    initial: 0
                },
                getQuestionsSettings()
            );
            templateName = selectedTemplateName;
        }

        const selectedTemplate = templates.find((tmp) => tmp.name === templateName);
        if (selectedTemplate) {
            const newConfig = { ...config };
            newConfig.templates = selectedTemplate.files;
            if (selectedTemplate.folderPath) {
                newConfig.folderPath = selectedTemplate.folderPath;
            }
            return { config: newConfig, templateName: selectedTemplate.name };
        }
    }

    return { config, templateName };
};
