import Prompt from 'prompts';
import kleur from 'kleur';

import { getQuestionsSettings } from './getQuestionsSettings';
import { TEMPLATE_NAMES_SELECTING_INSTRUCTIONS } from './constants';
import { CommandLineFlags, Config, Project, TemplateDescriptionObject } from './types';
import { generateFileName, getFileTemplates, getIsFileAlreadyExists } from './helpers';

type Properties = {
    root: string;
    commandLineFlags: CommandLineFlags;
    config: Config;
    project: Project;
    componentNames: string[];
};

export const getTemplateNamesToUpdate = async ({
    root,
    commandLineFlags,
    config: { templates, processFileAndFolderName },
    project,
    componentNames
}: Properties) => {
    const componentName = componentNames[0];
    const { fileTemplates, undefinedFileTemplates } = getFileTemplates({ commandLineFlags, templates });

    if (commandLineFlags.files) {
        if (undefinedFileTemplates.length > 0) {
            console.error('Error: Undefined file templates:');
            console.error(undefinedFileTemplates.join('\n'));
            process.exit();
            return;
        }

        return fileTemplates;
    }

    const choices = Object.entries(templates as TemplateDescriptionObject).map(([tmpFileName, options]) => {
        const { default: isDefault = true, optional: isOptional = false, name } = options;
        const fileName = generateFileName({
            fileNameTemplate: name,
            objectName: componentName,
            processFileAndFolderName
        });
        const isAlreadyExists = getIsFileAlreadyExists({
            root,
            fileNameTemplate: name,
            objectName: componentName,
            processFileAndFolderName,
            project
        });
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
                // @ts-ignore
                onRender() {
                    if (!initialized) {
                        const choiceToSelect = choices.findIndex((choice) => choice.selected);
                        // @ts-ignore
                        this.cursor = choiceToSelect !== -1 ? choiceToSelect : 0;
                        initialized = true;
                    }
                }
            },
            getQuestionsSettings()
        )
    ).templateNames;
};
