import { program } from 'commander';

import { componentSettingsMap } from './componentSettingsMap';
import { Setting } from './types';
import { processCommandLineArguments } from './helpers';

export const processCommandLineFlags = () => {
    program.option('-u, --update', 'update mode, to add or replace files in existent object');
    program.option('-n, --name <type>', 'object name');
    program.option('-t, --template <type>', 'template name');
    program.option('-d, --dest <type>', 'path for creation');
    program.option('-p, --project <type>', 'project name');
    program.parse(processCommandLineArguments(process.argv));

    const commandLineKeys: (keyof Setting['commandLineFlags'])[] = ['update', 'dest', 'project', 'name', 'template'];

    const { update = false, dest = '', name = '', template = '', project = '' } = commandLineKeys.reduce(
        (acc, key) => ({
            ...acc,
            [key]: Object.prototype.hasOwnProperty.call(program, key) ? program[key] : undefined
        }),
        {} as Setting['commandLineFlags']
    );

    componentSettingsMap.commandLineFlags = { update, dest, name, template, project };
};
