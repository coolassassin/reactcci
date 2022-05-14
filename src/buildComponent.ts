import kleur from 'kleur';

import path from 'path';

import { getTemplateNamesToCreate } from './getTemplateNamesToCreate';
import { generateFiles } from './generateFiles';
import { getTemplateFile } from './getTemplateFile';
import { getFinalAgreement } from './getFinalAgreement';
import { processAfterGeneration } from './processAfterGeneration';
import { CommandLineFlags, ComponentFileList, Config, FilesList, Project, TemplateDescriptionObject } from './types';
import { capitalizeName, generateFileName, getIsFileAlreadyExists, writeToConsole } from './helpers';
import { getTemplateNamesToUpdate } from './getTemplateNamesToUpdate';

type Properties = {
    root: string;
    moduleRoot: string;
    commandLineFlags: CommandLineFlags;
    config: Config;
    project: Project;
    templateName: string;
    componentNames: string[];
    projectRootPath: string;
    resultPath: string;
};

export const buildComponent = async (properties: Properties) => {
    const { commandLineFlags, config, project, templateName, componentNames, projectRootPath, resultPath } = properties;
    const { processFileAndFolderName } = config;

    const templateNames = commandLineFlags.update
        ? await getTemplateNamesToUpdate(properties)
        : await getTemplateNamesToCreate(properties);

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

    const componentFileList: ComponentFileList = {};

    for (const componentName of componentNames) {
        componentFileList[componentName] = Object.fromEntries(
            Object.entries(fileList)
                .filter(([, fileObject]) => {
                    return (
                        fileObject.selected ||
                        getIsFileAlreadyExists({
                            ...properties,
                            fileNameTemplate: fileObject.name,
                            objectName: componentName,
                            processFileAndFolderName
                        })
                    );
                })
                .map(([tmpName, fileObject]) => [
                    tmpName,
                    {
                        ...fileObject,
                        name: generateFileName({
                            fileNameTemplate: fileObject.name,
                            objectName: componentName,
                            processFileAndFolderName
                        })
                    }
                ])
        );
    }

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
        await generateFiles({
            ...properties,
            componentFileList
        });
        await processAfterGeneration({
            ...properties,
            componentFileList
        });
        const verb = componentNames.length > 1 ? 's are ' : ` is `;
        const action = commandLineFlags.update ? 'updated' : 'created';
        writeToConsole(kleur.green(`\n${capitalizeName(templateName)}${verb}${action}!!! \\(•◡ •)/ `));
    } else {
        writeToConsole("No? Let's build another one! (◉ ◡ ◉ )");
    }
};
