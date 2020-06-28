import { program } from 'commander';
import { componentSettingsMap } from './componentSettingsMap';
import { Setting } from './types';

export const processCommandLineFlags = () => {
    program.option('-d, --dist <type>', 'path for creation');
    program.option('-n, --name <type>', 'component name');
    program.option('-p, --project <type>', 'project name');
    program.parse(process.argv);

    const commandLineKeys: (keyof Setting['commandLineFlags'])[] = ['dist', 'project', 'name'];

    const { dist = '', name = '', project = '' } = Object.fromEntries(
        // @ts-ignore
        Object.entries(program).filter(([key]) => commandLineKeys.includes(key))
    );

    componentSettingsMap.commandLineFlags = { dist, name, project };
};
