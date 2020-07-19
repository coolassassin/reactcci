import { program } from 'commander';

import { componentSettingsMap } from './componentSettingsMap';
import { Setting } from './types';

export const processCommandLineFlags = () => {
    program.option('--init', 'initialize cli, generate default config');
    program.option('-d, --dest <type>', 'path for creation');
    program.option('-n, --name <type>', 'component name');
    program.option('-p, --project <type>', 'project name');
    program.parse(process.argv);

    const commandLineKeys: (keyof Setting['commandLineFlags'])[] = ['init', 'dest', 'project', 'name'];

    const { init = false, dest = '', name = '', project = '' } = Object.fromEntries(
        // @ts-ignore
        Object.entries(program).filter(([key]) => commandLineKeys.includes(key))
    );

    componentSettingsMap.commandLineFlags = { init, dest, name, project };
};
