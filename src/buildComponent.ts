import kleur from 'kleur';

import path from 'path';

import { componentSettingsMap } from './componentSettingsMap';
import { getTemplates } from './getTemplates';
import { generateFiles } from './generateFiles';
import { getTemplateFile } from './getTemplateFile';
import { getFinalAgreement } from './getFinalAgreement';
import { processAfterGeneration } from './processAfterGeneration';
import { FilesList, TemplateDescription, Setting } from './types';
import { capitalizeName, writeToConsole } from './helpers';

export const buildComponent = async () => {
    const { config, project, componentNames, projectRootPath, resultPath, templateName } = componentSettingsMap;

    const templateNames = await getTemplates();

    const fileList: FilesList = {};

    for (const templateName of templateNames) {
        const { name, file } = config.templates[templateName] as TemplateDescription;
        if (Array.isArray(file)) {
            const selectedFile = await getTemplateFile(templateName, file);
            fileList[templateName] = { name, file: selectedFile.name, type: selectedFile.description };
        } else {
            fileList[templateName] = { name, file: file as string };
        }
    }

    const componentFileList: Setting['componentFileList'] = {};

    for (const componentName of componentNames) {
        componentFileList[componentName] = Object.fromEntries(
            Object.entries(fileList).map(([tmpName, fileObject]) => [
                tmpName,
                { ...fileObject, name: fileObject.name.replace('[name]', componentName) }
            ])
        );
    }

    componentSettingsMap.componentFileList = componentFileList;

    if (!config.skipFinalStep) {
        for (const componentName of componentNames) {
            writeToConsole(`\nCreating ${templateName} ${kleur.yellow(componentName)}`);
            writeToConsole(
                `Files:\n${Object.entries(componentFileList[componentName])
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

    if (config.skipFinalStep || (await getFinalAgreement())) {
        await generateFiles();
        await processAfterGeneration();
        writeToConsole(kleur.green(`\n${capitalizeName(templateName)} is created!!! \\(•◡ •)/ `));
    } else {
        writeToConsole("No? Let's build another one! (◉ ◡ ◉ )");
    }
};
