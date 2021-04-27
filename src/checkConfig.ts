import kleur from 'kleur';

import { componentSettingsMap } from './componentSettingsMap';
import { TypingCases } from './types';

export const checkConfig = async () => {
    const {
        config: { templates, afterCreation, processFileAndFolderName }
    } = componentSettingsMap;
    const stopProgram = () => {
        process.exit(1);
    };

    if (Array.isArray(templates)) {
        if (templates.some((tmp) => !tmp.name)) {
            console.error(kleur.red(`Template name must be declared`));
            stopProgram();
        }
        if (templates.some((tmp) => templates.filter((t) => t.name === tmp.name).length > 1)) {
            console.error(kleur.red(`Template name must be unique, please revise config file`));
            stopProgram();
        }
    }

    if (processFileAndFolderName && typeof processFileAndFolderName !== 'function') {
        const cases: TypingCases[] = ['camelCase', 'PascalCase', 'snake_case', 'dash-case'];

        if (!cases.some((c) => c === processFileAndFolderName)) {
            console.error(
                kleur.red(
                    `Unknown config type in "processFileAndFolderName" field: ${kleur.yellow(processFileAndFolderName)}`
                )
            );
            console.error(`Available cases:\n- ${cases.join('\n- ')}`);
            stopProgram();
        }
    }

    if (afterCreation) {
        for (const [type, command] of Object.entries(afterCreation)) {
            if (!command.cmd) {
                console.error(kleur.red(`Undeclared "cmd" option for afterCreation script ${kleur.yellow(type)}`));
                stopProgram();
            }
            if (command.extensions && !Array.isArray(command.extensions)) {
                console.error(
                    kleur.red(`The option "extension" for afterCreation script ${kleur.yellow(type)} must be an array`)
                );
                stopProgram();
            }
            if (!command.cmd.includes('[filepath]')) {
                console.error(kleur.red(`Wrong "cmd" option for afterCreation script ${kleur.yellow(type)}`));
                stopProgram();
            }
        }
    }
};
