import { program } from 'commander';

import { componentSettingsMap } from './componentSettingsMap';
import { Setting } from './types';
import { processCommandLineArguments } from './helpers';

export const processCommandLineFlags = () => {
    program.option('--init', 'initialize cli, generate default config');
    program.option('-u, --update', 'update mode, to add or replace files in existent component');
    program.option('-d, --dest <type>', 'path for creation');
    program.option('-n, --name <type>', 'component name');
    program.option('-p, --project <type>', 'project name');
    program.parse(processCommandLineArguments(process.argv));

    const commandLineKeys: (keyof Setting['commandLineFlags'])[] = ['init', 'update', 'dest', 'project', 'name'];

    const { init = false, update = false, dest = '', name = '', project = '' } = commandLineKeys.reduce(
        (acc, key) => ({
            ...acc,
            [key]: Object.prototype.hasOwnProperty.call(program, key) ? program[key] : undefined
        }),
        {} as Setting['commandLineFlags']
    );

    componentSettingsMap.commandLineFlags = { init, update, dest, name, project };
};
