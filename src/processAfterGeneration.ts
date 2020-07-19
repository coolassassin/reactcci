import kleur from 'kleur';

import path from 'path';
import childProcess from 'child_process';

import { componentSettingsMap } from './componentSettingsMap';

export const processAfterGeneration = async () => {
    const {
        root,
        project,
        resultPath,
        projectRootPath,
        componentName,
        fileList,
        config: { afterCreation }
    } = componentSettingsMap;

    const finalFolder = path.join(root, project, projectRootPath, resultPath, componentName);

    if (afterCreation) {
        for (const [, file] of Object.entries(fileList)) {
            let processed = false;
            for (const [type, command] of Object.entries(afterCreation)) {
                try {
                    if (!command.extensions || command.extensions.some((ext) => file.name.endsWith(ext))) {
                        if (!processed) {
                            processed = true;
                            console.log(`\nProcessing ${file.name}`);
                        }
                        const filePath = path.join(finalFolder, file.name);
                        childProcess.execSync(command.cmd.replace('[filepath]', filePath));
                        console.log(`  ${kleur.green('√')} ${type}`);
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
};
