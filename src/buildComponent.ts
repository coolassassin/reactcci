import kleur from 'kleur';

import path from 'path';

import { componentSettingsMap } from './componentSettingsMap';
import { getTemplates } from './getTemplates';
import { generateFiles } from './generateFiles';
import { getTemplateFile } from './getTemplateFile';
import { getFinalAgreement } from './getFinalAgreement';
import { processAfterGeneration } from './processAfterGeneration';
import { Setting, TemplateDescription } from './types';
import { capitalizeName, writeToConsole } from './helpers';

export const buildComponent = async () => {
    const { config, project, componentName, projectRootPath, resultPath, templateName } = componentSettingsMap;

    const templateNames = await getTemplates();

    const fileList: Setting['fileList'] = {};

    for (const templateName of templateNames) {
        const { name, file } = config.templates[templateName] as TemplateDescription;
        const fileName = name.replace('[name]', componentName);
        if (Array.isArray(file)) {
            const selectedFile = await getTemplateFile(templateName, file);
            fileList[templateName] = { name: fileName, file: selectedFile.name, type: selectedFile.description };
        } else {
            fileList[templateName] = { name: fileName, file: file as string };
        }
    }

    componentSettingsMap.fileList = fileList;

    if (!config.skipFinalStep) {
        writeToConsole(`\nCreating ${templateName} ${kleur.yellow(componentName)}`);
        writeToConsole(
            `\nFile list:\n${Object.entries(fileList)
                .map(
                    ([tmp, options]) =>
                        `- ${tmp}${options.type ? ` (${kleur.yellow(options.type)})` : ''}${kleur.gray(
                            ` - ${options.name}`
                        )}`
                )
                .join('\n')}`
        );
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
