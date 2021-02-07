import { program } from 'commander';

import { componentSettingsMap } from './componentSettingsMap';
import { Setting } from './types';
import { processCommandLineArguments } from './helpers';

export const processCommandLineFlags = () => {
    program.option('-u, --update', 'update mode, to add or replace files in existent object');
    program.option('-n, --name <type>', 'object name');
    program.option('-t, --template <type>', 'template name');
    program.option('-d, --dest <type>', 'path for creation');
    program.option('-s, --skip-search', 'skip search (default or destination folder)');
    program.option('-p, --project <type>', 'project name');
    program.option('-f, --files <type>', 'file types (style, test, stories)');
    program.option('--sls', 'skip last step');
    program.parse(processCommandLineArguments(process.argv));

    const commandLineKeys: (keyof Setting['commandLineFlags'])[] = [
        'update',
        'dest',
        'project',
        'name',
        'template',
        'files',
        'skipSearch',
        'sls'
    ];

    const {
        update = false,
        skipSearch = false,
        sls = false,
        dest = '',
        name = '',
        template = '',
        project = '',
        files = ''
    } = commandLineKeys.reduce(
        (acc, key) => ({
            ...acc,
            [key]: Object.prototype.hasOwnProperty.call(program, key) ? program[key] : undefined
        }),
        {} as Setting['commandLineFlags']
    );

    componentSettingsMap.commandLineFlags = { update, skipSearch, sls, dest, name, template, project, files };
};
