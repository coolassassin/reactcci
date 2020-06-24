import { getQuestionsSettings } from './getQuestionsSettings';
import Prompt from 'prompts';
import { componentSettingsMap } from './componentSettingsMap';

export const getTemplates = async () => {
    const { config } = componentSettingsMap;

    const optionalTemplates = Object.entries(config.templates).filter(([, options]) => options.optional);
    let optionalTemplateNames = [];
    if (optionalTemplates.length) {
        optionalTemplateNames = (await Prompt(
            {
                type: 'multiselect',
                name: 'templateNames',
                message: 'Choose files to generate',
                instructions:
                    '\nOptions:\n' +
                    '    ↑/↓: Select file\n' +
                    '    ←/→/[Space]: Check/uncheck file\n' +
                    '    a: Select all\n' +
                    '    Enter/Return: End settings\n',
                choices: Object.entries(config.templates)
                    .filter(([, options]) => options.optional)
                    .map(([name, options]) => {
                        const { default: selected = true } = options;
                        return { title: name, value: name, selected };
                    }),
            },
            getQuestionsSettings()
        )).templateNames;
    }

    return [
        ...Object.entries(config.templates)
            .filter(([, options]) => !options.optional)
            .map(([name]) => name),
        ...optionalTemplateNames,
    ];
};
