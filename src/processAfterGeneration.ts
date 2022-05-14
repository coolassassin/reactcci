import kleur from 'kleur';

import path from 'path';
import childProcess from 'child_process';

import { componentSettingsMap } from './componentSettingsMap';
import { processObjectName, writeToConsole } from './helpers';
import { Config, Project } from './types';

type Properties = {
    root: string;
    config: Config;
    project: Project;
    componentNames: string[];
    resultPath: string;
    projectRootPath: string;
};

export const processAfterGeneration = async ({
    root,
    config: { afterCreation, processFileAndFolderName },
    project,
    componentNames,
    projectRootPath,
    resultPath
}: Properties) => {
    const { componentFileList } = componentSettingsMap;
    if (afterCreation) {
        for (const [type, command] of Object.entries(afterCreation)) {
            let isFirstExecution = true;
            for (const componentName of componentNames) {
                const fileList = Object.values(componentFileList[componentName]).filter((file) => file.selected);
                const finalFolder = path.join(
                    root,
                    project,
                    projectRootPath,
                    resultPath,
                    processObjectName({ name: componentName, isFolder: true, processFileAndFolderName })
                );

                if (
                    command.extensions &&
                    !command.extensions.some((ext) => fileList.some((file) => file.name.endsWith(ext)))
                ) {
                    break;
                }

                if (isFirstExecution) {
                    writeToConsole(`Executing ${kleur.yellow(type)} script:`);
                    isFirstExecution = false;
                }

                if (componentNames.length > 1) {
                    writeToConsole(`  ${componentName}`);
                }

                for (const file of fileList) {
                    try {
                        if (!command.extensions || command.extensions.some((ext) => file.name.endsWith(ext))) {
                            const filePath = path.join(finalFolder, file.name);
                            childProcess.execSync(command.cmd.replace('[filepath]', filePath));
                            writeToConsole(
                                `${componentNames.length > 1 ? '    ' : '  '}${kleur.green('√')} ${file.name}`
                            );
                        }
                    } catch (e) {
                        console.error(
                            kleur.red(
                                `Unexpected error during processing ${kleur.yellow(file.name)} with ${kleur.yellow(
                                    type
                                )} command`
                            )
                        );
                        console.error(e);
                    }
                }
            }
        }
    }
};
