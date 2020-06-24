import chalk from 'chalk';
import { componentSettingsMap } from './componentSettingsMap';

export const checkConfig = async () => {
    const {
        config: { afterCreation },
    } = componentSettingsMap;
    const stopProgram = () => {
        process.exit(1);
    };

    if (afterCreation) {
        for (const [type, command] of Object.entries(afterCreation)) {
            if (!command.cmd) {
                console.error(chalk.red(`Undeclared "cmd" option for afterCreation script ${chalk.yellow(type)}`));
                stopProgram();
            }
            if (command.extensions && !Array.isArray(command.extensions)) {
                console.error(
                    chalk.red(`The option "extension" for afterCreation script ${chalk.yellow(type)} must be an array`)
                );
                stopProgram();
            }
            if (!command.cmd.includes('[filename]')) {
                console.error(chalk.red(`Wrong "cmd" option for afterCreation script ${chalk.yellow(type)}`));
                stopProgram();
            }
        }
    }
};
