import kleur from 'kleur';

import path from 'path';
import childProcess from 'child_process';

import { componentSettingsMap } from './componentSettingsMap';
import { writeToConsole } from './helpers';

export const processAfterGeneration = async () => {
    const {
        root,
        project,
        resultPath,
        projectRootPath,
        componentNames,
        componentFileList,
        config: { afterCreation }
    } = componentSettingsMap;
    if (afterCreation) {
        for (const [type, command] of Object.entries(afterCreation)) {
            writeToConsole(`Executing ${kleur.yellow(type)} script:`);
            for (const componentName of componentNames) {
                if (componentNames.length > 1) {
                    writeToConsole(`  ${componentName}`);
                }
                const fileList = componentFileList[componentName];
                const finalFolder = path.join(root, project, projectRootPath, resultPath, componentName);

                for (const [, file] of Object.entries(fileList)) {
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
