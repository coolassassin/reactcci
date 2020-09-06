import Prompt from 'prompts';
import kleur from 'kleur';

import fs from 'fs';
import path from 'path';

import { getQuestionsSettings } from './getQuestionsSettings';
import { componentSettingsMap } from './componentSettingsMap';
import { TEMPLATE_NAMES_SELECTING_INSTRUCTIONS } from './constants';
import { TemplateDescriptionObject } from './types';
import { generateFileName } from './helpers';

export const getTemplateNamesToUpdate = async () => {
    const { root, project, config, componentNames, projectRootPath, resultPath } = componentSettingsMap;

    const choices = Object.entries(config.templates as TemplateDescriptionObject).map(([tmpFileName, options]) => {
        const { default: isDefault = true, optional: isOptional = false, name } = options;
        const folder = path.join(root, project, projectRootPath, resultPath, componentNames[0]);
        const fileName = generateFileName(name, componentNames[0]);
        const isAlreadyExists = fs.existsSync(path.resolve(folder, fileName));
        return {
            title: `${tmpFileName}${kleur.reset(
                ` (${isAlreadyExists ? 'Replace' : 'Create'}: ${kleur.yellow(fileName)})`
            )}`,
            value: tmpFileName,
            selected: isOptional && isDefault && !isAlreadyExists,
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
