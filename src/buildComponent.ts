import chalk from 'chalk';
import path from 'path';
import { componentSettingsMap } from './componentSettingsMap';
import { getTemplates } from './getTemplates';
import { generateFiles } from './generateFiles';
import { getTemplateFile } from './getTemplateFile';
import { getFinalAgreement } from './getFinalAgreement';
import { processAfterGeneration } from './processAfterGeneration';
import { Setting } from './types';

export const buildComponent = async () => {
    const { config, project, componentName, projectRootPath, resultPath } = componentSettingsMap;

    const templateNames = await getTemplates();

    const fileList: Setting['fileList'] = {};

    for (const templateName of templateNames) {
        const { name, file } = config.templates[templateName];
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
        console.log(`\nCreating component ${chalk.yellow(componentName)}`);
        console.log(
            `\nFile list:\n${Object.entries(fileList)
                .map(
                    ([tmp, options]) =>
                        `- ${tmp}${options.type ? ` (${chalk.yellow(options.type)})` : ''}${chalk.gray(
                            ` - ${options.name}`
                        )}`
                )
                .join('\n')}`
        );
        console.log(`\nFolder: ${chalk.yellow(path.join(project, projectRootPath, resultPath))}`);
    }

    if (config.skipFinalStep || await getFinalAgreement()) {
        await generateFiles();
        await processAfterGeneration();
        console.log(chalk.green('\nComponent is created!!! \\(•◡ •)/ '));
    } else {
        console.log("No? Let's build another one! (◉ ◡ ◉ )");
    }
};
