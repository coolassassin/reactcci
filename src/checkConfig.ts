import kleur from 'kleur';

import { componentSettingsMap } from './componentSettingsMap';

export const checkConfig = async () => {
    const {
        config: { afterCreation }
    } = componentSettingsMap;
    const stopProgram = () => {
        process.exit(1);
    };

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
