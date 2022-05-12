import kleur from 'kleur';

import path from 'path';

import { componentSettingsMap } from './componentSettingsMap';
import { getTemplateNamesToCreate } from './getTemplateNamesToCreate';
import { generateFiles } from './generateFiles';
import { getTemplateFile } from './getTemplateFile';
import { getFinalAgreement } from './getFinalAgreement';
import { processAfterGeneration } from './processAfterGeneration';
import { CommandLineFlags, FilesList, Setting, TemplateDescriptionObject } from './types';
import { capitalizeName, generateFileName, getIsFileAlreadyExists, writeToConsole } from './helpers';
import { getTemplateNamesToUpdate } from './getTemplateNamesToUpdate';

type Properties = {
    root: string;
    moduleRoot: string;
    commandLineFlags: CommandLineFlags;
};

export const buildComponent = async ({ root, moduleRoot, commandLineFlags }: Properties) => {
    const { config, project, componentNames, projectRootPath, resultPath, templateName } = componentSettingsMap;

    const templateNames = commandLineFlags.update
        ? await getTemplateNamesToUpdate({ root, commandLineFlags })
        : await getTemplateNamesToCreate({ commandLineFlags });

    const fileList: FilesList = {};

    for (const [templateName, { name, file }] of Object.entries(config.templates as TemplateDescriptionObject)) {
        const isTemplateSelected = templateNames.includes(templateName);
        if (Array.isArray(file) && isTemplateSelected) {
            const selectedFile = await getTemplateFile({ commandLineFlags, name: templateName, files: file });
            fileList[templateName] = {
                name,
                file: selectedFile.name,
                type: selectedFile.description,
                selected: isTemplateSelected
            };
        } else {
            fileList[templateName] = { name, file: file as string, selected: isTemplateSelected };
        }
    }

    const componentFileList: Setting['componentFileList'] = {};

    for (const componentName of componentNames) {
        componentFileList[componentName] = Object.fromEntries(
            Object.entries(fileList)
                .filter(([, fileObject]) => {
                    return (
                        fileObject.selected ||
                        getIsFileAlreadyExists({ root, fileNameTemplate: fileObject.name, objectName: componentName })
                    );
                })
                .map(([tmpName, fileObject]) => [
                    tmpName,
                    {
                        ...fileObject,
                        name: generateFileName(fileObject.name, componentName)
                    }
                ])
        );
    }

    componentSettingsMap.componentFileList = componentFileList;

    if (!config.skipFinalStep) {
        for (const componentName of componentNames) {
            if (commandLineFlags.update) {
                writeToConsole(`\nUpdating ${templateName} ${kleur.yellow(componentName)}`);
            } else {
                writeToConsole(`\nCreating ${templateName} ${kleur.yellow(componentName)}`);
            }
            writeToConsole(
                `Files:\n${Object.entries(componentFileList[componentName])
                    .filter(([, options]) => options.selected)
                    .map(
                        ([tmp, options]) =>
                            `- ${tmp}${options.type ? ` (${kleur.yellow(options.type)})` : ''}${kleur.gray(
                                ` - ${options.name}`
                            )}`
                    )
                    .join('\n')}`
            );
        }
        writeToConsole(`\nFolder: ${kleur.yellow(path.join(project, projectRootPath, resultPath))}`);
    }

    if (config.skipFinalStep || commandLineFlags.sls || (await getFinalAgreement())) {
        await generateFiles({ root, moduleRoot });
        await processAfterGeneration({ root });
        const verb = componentNames.length > 1 ? 's are ' : ` is `;
        const action = commandLineFlags.update ? 'updated' : 'created';
        writeToConsole(kleur.green(`\n${capitalizeName(templateName)}${verb}${action}!!! \\(•◡ •)/ `));
    } else {
        writeToConsole("No? Let's build another one! (◉ ◡ ◉ )");
    }
};
