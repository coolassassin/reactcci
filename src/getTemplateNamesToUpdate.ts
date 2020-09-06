import Prompt from 'prompts';
import kleur from 'kleur';

import { getQuestionsSettings } from './getQuestionsSettings';
import { componentSettingsMap } from './componentSettingsMap';
import { TEMPLATE_NAMES_SELECTING_INSTRUCTIONS } from './constants';
import { TemplateDescriptionObject } from './types';
import { generateFileName, getIsFileAlreadyExists } from './helpers';

export const getTemplateNamesToUpdate = async () => {
    const { config, componentNames } = componentSettingsMap;

    const choices = Object.entries(config.templates as TemplateDescriptionObject).map(([tmpFileName, options]) => {
        const { default: isDefault = true, optional: isOptional = false, name } = options;
        const fileName = generateFileName(name, componentNames[0]);
        const isAlreadyExists = getIsFileAlreadyExists(name, componentNames[0]);
        return {
            title: `${tmpFileName}${kleur.reset(
                ` (${isAlreadyExists ? 'Replace' : 'Create'}: ${kleur.yellow(fileName)})`
            )}`,
            value: tmpFileName,
            selected: (isOptional && isDefault && !isAlreadyExists) || (!isOptional && !isAlreadyExists),
            exists: isAlreadyExists
        };
    });

    let initialized = false;
    return (
        await Prompt(
            {
                type: 'multiselect',
                name: 'templateNames',
                message: 'Select files to replace or create',
                instructions: TEMPLATE_NAMES_SELECTING_INSTRUCTIONS,
                choices,
                onRender() {
                    if (!initialized) {
                        const choiceToSelect = choices.findIndex((choice) => choice.selected);
                        this.cursor = choiceToSelect !== -1 ? choiceToSelect : 0;
                        initialized = true;
                    }
                }
            },
            getQuestionsSettings()
        )
    ).templateNames;
};
